import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Linking,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import api from "../../assets/services/api";
import { agregarOActualizarConversacion } from "../chats/index";

function iconoCategoria(cat) {
  const mapa = {
    Tecnologia: "📱", Muebles: "🛋️", Ropa: "👕", Electrodomésticos: "🍳",
  };
  return mapa[cat] || "🏷️";
}

function formatPrecio(valor) {
  return "$" + Number(valor).toLocaleString("es-CO");
}

export default function DetalleProducto() {
  const router  = useRouter();
  const { id }  = useLocalSearchParams();

  const [producto, setProducto] = useState(null);
  const [vendedor, setVendedor] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error,    setError]    = useState(null);
  const [llamando, setLlamando] = useState(false);

  async function cargarDetalle() {
    setCargando(true);
    setError(null);
    try {
      const res   = await api.get("/api/v1/comercio/filtro");
      const lista = Array.isArray(res.data?.data) ? res.data.data
                  : Array.isArray(res.data)        ? res.data
                  : [];
      const prod  = lista.find(function (p) { return p._id === id; }) || lista[0];
      if (!prod) throw new Error("Producto no encontrado");
      setProducto(prod);

      if (prod.vendedor_id) {
        try {
          const resV   = await api.get("/api/v1/usuarios/filtro");
          const listaV = Array.isArray(resV.data?.data) ? resV.data.data
                       : Array.isArray(resV.data)        ? resV.data
                       : [];
          const v = listaV.find(function (u) { return u._id === prod.vendedor_id; });
          setVendedor(v || null);
        } catch (_) {}
      }
    } catch (err) {
      setError(err.message || "No se pudo cargar el producto");
    } finally {
      setCargando(false);
    }
  }

  useEffect(function () {
    if (id) cargarDetalle();
  }, [id]);

  // ── Llamar ────────────────────────────────────────────────────
  function llamar() {
    const tel = vendedor?.telefono;

    if (!tel) {
      // Sin teléfono: simulación visual
      setLlamando(true);
      setTimeout(function () { setLlamando(false); }, 4000);
      return;
    }

    const url = "tel:" + tel.replace(/\s/g, "");
    Linking.canOpenURL(url).then(function (puede) {
      if (puede) {
        Linking.openURL(url);
      } else {
        // Web no puede abrir tel: → simulación
        setLlamando(true);
        setTimeout(function () { setLlamando(false); }, 4000);
      }
    });
  }

  // ── Mensaje interno ───────────────────────────────────────────
  function abrirChat() {
    if (!vendedor) {
      Alert.alert("Sin vendedor", "No hay información del vendedor para iniciar el chat.");
      return;
    }
    const msgInicial = `Hola ${vendedor.nombres}, vi tu producto "${producto.texto}" (${formatPrecio(producto.precio)}) en Convivva. ¿Está disponible?`;
    agregarOActualizarConversacion(vendedor, producto, msgInicial);
    router.push("/chats/" + vendedor._id);
  }

  // ── Estados ───────────────────────────────────────────────────
  if (cargando) {
    return (
      <View style={s.centrado}>
        <ActivityIndicator color="#6fa8c2" size="large" />
      </View>
    );
  }

  if (error || !producto) {
    return (
      <View style={s.centrado}>
        <Text style={{ fontSize: 36, marginBottom: 10 }}>⚠️</Text>
        <Text style={s.errorTexto}>{error || "Producto no encontrado"}</Text>
        <Pressable style={s.btnVolver} onPress={function () { router.back(); }}>
          <Text style={s.btnVolverTexto}>← Volver</Text>
        </Pressable>
      </View>
    );
  }

  // Vendedor de muestra cuando no hay datos reales
  const nombreVendedor = vendedor
    ? `${vendedor.nombres} ${vendedor.apellidos}`
    : "Vendedor";
  const inicialVendedor = vendedor?.nombres?.charAt(0).toUpperCase() || "V";

  return (
    <View style={s.pantalla}>

      {/* ── Simulación de llamada ── */}
      {llamando && (
        <View style={s.llamadaOverlay}>
          <View style={s.llamadaCard}>
            <View style={s.llamadaAvatar}>
              <Text style={{ fontSize: 40, color: "#fff", fontWeight: "700" }}>
                {inicialVendedor}
              </Text>
            </View>
            <Text style={s.llamadaNombre}>{nombreVendedor}</Text>
            {vendedor && (
              <Text style={s.llamadaSubtexto}>
                🏢 Torre {vendedor.torre} · Apto {vendedor.apto}
              </Text>
            )}
            <Text style={s.llamadaEstado}>Llamando...</Text>
            <Pressable style={s.btnColgar} onPress={function () { setLlamando(false); }}>
              <Text style={{ fontSize: 28 }}>📵</Text>
            </Pressable>
            <Text style={{ color: "#fff", fontSize: 12, marginTop: 8, opacity: 0.7 }}>
              Toca para colgar
            </Text>
          </View>
        </View>
      )}

      {/* Header */}
      <View style={s.header}>
        <Pressable onPress={function () { router.back(); }} style={s.btnBack}>
          <Text style={s.btnBackTexto}>←</Text>
        </Pressable>
        <Text style={s.headerTitulo} numberOfLines={1}>Detalle del producto</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={s.scroll} contentContainerStyle={s.scrollContent} showsVerticalScrollIndicator={false}>

        {/* Imagen */}
        <View style={s.imagenBox}>
          <Text style={s.imagenIcono}>{iconoCategoria(producto.categoria)}</Text>
          {producto.disponible && (
            <View style={s.disponibleBadge}>
              <Text style={s.disponibleTexto}>Disponible</Text>
            </View>
          )}
        </View>

        {/* Info del producto */}
        <View style={s.infoBox}>
          <Text style={s.nombre}>{producto.texto}</Text>
          <Text style={s.precio}>{formatPrecio(producto.precio)}</Text>
          <View style={s.fila}>
            <View style={s.etiqueta}>
              <Text style={s.etiquetaTexto}>{producto.categoria}</Text>
            </View>
            <Text style={s.torre}>🏢 Torre {producto.torre}</Text>
          </View>
        </View>

        <View style={s.divisor} />

        {/* ── Vendedor ── */}
        <Text style={s.seccionTitulo}>Vendedor</Text>
        {vendedor ? (
          <View style={s.vendedorCard}>
            <View style={s.avatarCirculo}>
              <Text style={s.avatarLetra}>{inicialVendedor}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={s.vendedorNombre}>{nombreVendedor}</Text>
              <Text style={s.vendedorDetalle}>🏢 Torre {vendedor.torre} · Apto {vendedor.apto}</Text>
              {vendedor.telefono ? (
                <Text style={s.vendedorDetalle}>📞 {vendedor.telefono}</Text>
              ) : null}
              {vendedor.email ? (
                <Text style={s.vendedorDetalle}>✉️ {vendedor.email}</Text>
              ) : null}
            </View>
          </View>
        ) : (
          <View style={s.vendedorCard}>
            <View style={[s.avatarCirculo, { backgroundColor: "#aaa" }]}>
              <Text style={s.avatarLetra}>?</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={s.vendedorNombre}>Vendedor del conjunto</Text>
              <Text style={s.sinVendedor}>
                Los datos del vendedor no están disponibles en este momento.
              </Text>
            </View>
          </View>
        )}

        <View style={s.divisor} />

        {/* ── Botones de contacto ── */}
        <Text style={s.seccionTitulo}>Contactar</Text>
        <View style={s.botonesContacto}>

          <Pressable style={[s.btnContacto, s.btnLlamar]} onPress={llamar}>
            <Text style={s.btnContactoIcono}>📞</Text>
            <Text style={s.btnContactoTexto}>Llamar</Text>
          </Pressable>

          <Pressable style={[s.btnContacto, s.btnChat]} onPress={abrirChat}>
            <Text style={s.btnContactoIcono}>💬</Text>
            <Text style={s.btnContactoTexto}>Mensaje</Text>
          </Pressable>

        </View>

        <View style={{ height: 40 }} />
      </ScrollView>

    </View>
  );
}

const s = StyleSheet.create({
  pantalla:  { flex: 1, backgroundColor: "#cfd8dc" },
  centrado:  { flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: "#cfd8dc", padding: 30 },
  errorTexto:{ fontSize: 15, color: "#555", textAlign: "center", marginBottom: 20 },

  // Simulación llamada
  llamadaOverlay: {
    position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: "rgba(0,0,0,0.75)",
    alignItems: "center", justifyContent: "center",
    zIndex: 99,
  },
  llamadaCard: {
    backgroundColor: "#2f3e46", borderRadius: 28,
    padding: 36, alignItems: "center", width: "80%",
  },
  llamadaAvatar: {
    width: 90, height: 90, borderRadius: 45,
    backgroundColor: "#6fa8c2",
    alignItems: "center", justifyContent: "center", marginBottom: 16,
  },
  llamadaNombre:   { fontSize: 22, fontWeight: "700", color: "#fff", marginBottom: 4 },
  llamadaSubtexto: { fontSize: 13, color: "rgba(255,255,255,0.65)", marginBottom: 16 },
  llamadaEstado:   { fontSize: 15, color: "#a8d8ea", marginBottom: 30 },
  btnColgar: {
    width: 64, height: 64, borderRadius: 32,
    backgroundColor: "#e74c3c",
    alignItems: "center", justifyContent: "center",
  },

  header: {
    backgroundColor: "#6fa8c2",
    paddingTop: Platform.OS === "web" ? 25 : 55,
    paddingBottom: 18,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  btnBack:      { width: 40, height: 40, alignItems: "center", justifyContent: "center" },
  btnBackTexto: { fontSize: 26, color: "#fff", fontWeight: "700" },
  headerTitulo: { fontSize: 18, fontWeight: "700", color: "#fff", flex: 1, textAlign: "center" },

  scroll:        { flex: 1 },
  scrollContent: { padding: 18, paddingTop: 20 },

  imagenBox: {
    backgroundColor: "#e7f3f9", borderRadius: 20, height: 200,
    alignItems: "center", justifyContent: "center", marginBottom: 20,
  },
  imagenIcono: { fontSize: 80 },
  disponibleBadge: {
    position: "absolute", top: 14, right: 14,
    backgroundColor: "#27ae60",
    paddingHorizontal: 12, paddingVertical: 5, borderRadius: 20,
  },
  disponibleTexto: { color: "#fff", fontWeight: "700", fontSize: 12 },

  infoBox: {
    backgroundColor: "#fff", borderRadius: 16, padding: 16, marginBottom: 16,
    shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.07, shadowRadius: 6, elevation: 3,
  },
  nombre: { fontSize: 20, fontWeight: "700", color: "#2f3e46", marginBottom: 8, lineHeight: 26 },
  precio: { fontSize: 26, fontWeight: "800", color: "#6fa8c2", marginBottom: 12 },
  fila:   { flexDirection: "row", alignItems: "center", gap: 10 },
  etiqueta: { backgroundColor: "#e7f3f9", borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4 },
  etiquetaTexto: { fontSize: 12, color: "#2f7a9e", fontWeight: "600" },
  torre:  { fontSize: 13, color: "#666" },

  divisor:       { height: 1, backgroundColor: "#dce5ea", marginVertical: 16 },
  seccionTitulo: { fontSize: 16, fontWeight: "700", color: "#2f3e46", marginBottom: 12 },

  vendedorCard: {
    backgroundColor: "#fff", borderRadius: 16, padding: 14,
    flexDirection: "row", alignItems: "flex-start", gap: 14,
    shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.07, shadowRadius: 6, elevation: 3,
  },
  avatarCirculo: {
    width: 52, height: 52, borderRadius: 26,
    backgroundColor: "#6fa8c2", alignItems: "center", justifyContent: "center",
  },
  avatarLetra:    { fontSize: 22, fontWeight: "700", color: "#fff" },
  vendedorNombre: { fontSize: 15, fontWeight: "700", color: "#2f3e46", marginBottom: 3 },
  vendedorDetalle:{ fontSize: 12, color: "#666", marginTop: 2 },
  sinVendedor:    { fontSize: 12, color: "#999", fontStyle: "italic", marginTop: 4, lineHeight: 18 },

  botonesContacto: { flexDirection: "row", gap: 12 },
  btnContacto: {
    flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center",
    gap: 8, paddingVertical: 16, borderRadius: 14,
    shadowColor: "#000", shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.15, shadowRadius: 6, elevation: 4,
  },
  btnLlamar:        { backgroundColor: "#6fa8c2" },
  btnChat:          { backgroundColor: "#2f3e46" },
  btnContactoIcono: { fontSize: 20 },
  btnContactoTexto: { color: "#fff", fontWeight: "700", fontSize: 15 },

  btnVolver: { backgroundColor: "#6fa8c2", paddingHorizontal: 24, paddingVertical: 12, borderRadius: 12, marginTop: 16 },
  btnVolverTexto: { color: "#fff", fontWeight: "700" },
});
