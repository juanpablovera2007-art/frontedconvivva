import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useRouter } from "expo-router";
 
import Header from "../../assets/componentes/header.jsx";
import Navbar from "../../assets/componentes/navbar.jsx";
import global from "../../assets/styles/stylesheet.js";
import api from "../../assets/services/api";
 
const CATEGORIAS = ["Todas", "Tecnologia", "Muebles", "Ropa", "Electrodomésticos", "Otro"];
 
function formatPrecio(valor) {
  return "$" + Number(valor).toLocaleString("es-CO");
}
 
function iconoCategoria(cat) {
  const mapa = {
    Tecnologia:        "📱",
    Muebles:           "🛋️",
    Ropa:              "👕",
    Electrodomésticos: "🍳",
  };
  return mapa[cat] || "🏷️";
}
 
function extraerLista(data) {
  if (Array.isArray(data))             return data;
  if (Array.isArray(data?.data))       return data.data;
  if (Array.isArray(data?.data?.data)) return data.data.data;
  if (Array.isArray(data?.result))     return data.result;
  return [];
}
 
export default function Comercio() {
 
  const router = useRouter();
 
  const [productos, setProductos] = useState([]);
  const [cargando,  setCargando]  = useState(true);
  const [buscar,    setBuscar]    = useState("");
  const [categoria, setCategoria] = useState("Todas");
  const [error,     setError]     = useState(null);
 
  async function cargarProductos() {
    setCargando(true);
    setError(null);
    try {
      const res   = await api.get("/api/v1/comercio/filtro", { params: { disponible: true } });
      const lista = extraerLista(res.data);
      setProductos(lista);
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Error de conexión");
    } finally {
      setCargando(false);
    }
  }
 
  useEffect(function () { cargarProductos(); }, []);
 
  const filtrados = productos.filter(function (p) {
    const coincideTexto = (p.texto || "").toLowerCase().includes(buscar.toLowerCase());
    const coincideCat   = categoria === "Todas" || p.categoria === categoria;
    return coincideTexto && coincideCat;
  });
 
  return (
    <View style={global.pantalla}>
 
      <Header titulo="Comercio 🛒" />
 
      <View style={global.contenido}>
 
        {/* BUSCADOR */}
        <View style={s.buscadorBox}>
          <Text style={s.lupa}>🔍</Text>
          <TextInput
            style={s.buscador}
            placeholder="Buscar producto..."
            placeholderTextColor="#aaa"
            value={buscar}
            onChangeText={setBuscar}
          />
        </View>
 
        {/* CHIPS DE CATEGORÍA */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{ marginBottom: 14 }}
        >
          {CATEGORIAS.map(function (cat) {
            return (
              <Pressable
                key={cat}
                style={[global.chip, categoria === cat && global.chipActivo]}
                onPress={function () { setCategoria(cat); }}
              >
                <Text style={[global.chipTexto, categoria === cat && global.chipTextoActivo]}>
                  {cat}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>
 
        {/* CONTENIDO */}
        {cargando ? (
          <ActivityIndicator color="#6fa8c2" style={{ marginTop: 30 }} />
        ) : error ? (
          <View style={global.centrado}>
            <Text style={{ fontSize: 28, marginBottom: 10 }}>⚠️</Text>
            <Text style={[global.textoVacio, { color: "#e74c3c" }]}>{error}</Text>
            <Pressable style={s.reintentarBtn} onPress={cargarProductos}>
              <Text style={s.reintentarTexto}>Reintentar</Text>
            </Pressable>
          </View>
        ) : (
          <FlatList
            data={filtrados}
            keyExtractor={function (item, i) { return item._id || String(i); }}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <View style={global.centrado}>
                <Text style={{ fontSize: 36, marginBottom: 10 }}>🛒</Text>
                <Text style={global.textoVacio}>
                  {productos.length === 0
                    ? "No hay productos en el servidor"
                    : "Ningún producto coincide con el filtro"}
                </Text>
              </View>
            }
            renderItem={function ({ item }) {
              return (
                <Pressable
                  style={s.card}
                  onPress={function () {
                    router.push("/comercio/" + item._id);
                  }}
                >
                  <View style={s.iconoBox}>
                    <Text style={s.icono}>{iconoCategoria(item.categoria)}</Text>
                  </View>
 
                  <View style={{ flex: 1 }}>
                    <Text style={s.nombre} numberOfLines={2}>{item.texto}</Text>
                    <Text style={s.precio}>{formatPrecio(item.precio)}</Text>
                    <View style={s.filaEtiquetas}>
                      <View style={s.chipEtiqueta}>
                        <Text style={s.chipEtiquetaTexto}>{item.categoria}</Text>
                      </View>
                      <Text style={s.torre}>Torre {item.torre}</Text>
                    </View>
                  </View>
 
                  <View style={s.disponibleBadge}>
                    <Text style={s.disponibleTexto}>›</Text>
                  </View>
                </Pressable>
              );
            }}
          />
        )}
 
      </View>
 
      <Navbar />
    </View>
  );
}
 
const s = StyleSheet.create({
  buscadorBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 14,
    paddingHorizontal: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#dce5ea",
  },
  lupa:     { fontSize: 16, marginRight: 8 },
  buscador: { flex: 1, paddingVertical: 12, fontSize: 15, color: "#2f3e46" },
 
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
    gap: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  iconoBox: {
    width: 62,
    height: 62,
    borderRadius: 14,
    backgroundColor: "#e7f3f9",
    alignItems: "center",
    justifyContent: "center",
  },
  icono:  { fontSize: 32 },
  nombre: { fontSize: 14, fontWeight: "700", color: "#2f3e46", marginBottom: 3 },
  precio: { fontSize: 16, fontWeight: "800", color: "#6fa8c2", marginBottom: 6 },
 
  filaEtiquetas: { flexDirection: "row", alignItems: "center", gap: 8 },
  chipEtiqueta: {
    backgroundColor: "#e7f3f9",
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  chipEtiquetaTexto: { fontSize: 11, color: "#2f7a9e", fontWeight: "600" },
  torre: { fontSize: 12, color: "#999" },
 
  disponibleBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#e7f3f9",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
  },
  disponibleTexto: { fontSize: 20, color: "#6fa8c2", fontWeight: "700" },
 
  reintentarBtn: {
    marginTop: 16,
    backgroundColor: "#6fa8c2",
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 10,
  },
  reintentarTexto: { color: "#fff", fontWeight: "700" },
});