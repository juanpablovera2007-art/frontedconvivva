import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useRouter } from "expo-router";

import Navbar from "../assets/componentes/navbar";
import Header from "../assets/componentes/header";
import CardComunicado from "../assets/componentes/cardComunicado.jsx";
import global from "../assets/styles/stylesheet.js";
import api from "../assets/services/api";

const ACCESOS = [
  { label: "Comercio",    imagen: require("../assets/IMG/comercio.jpeg"),    ruta: "/comercio" },
  { label: "Comunicados", imagen: require("../assets/IMG/informacion.jpeg"), ruta: "/comunicados" },
];

// Formatea precio colombiano: 1850000 → $1.850.000
function formatPrecio(valor) {
  return "$" + Number(valor).toLocaleString("es-CO");
}

export default function Inicio() {
  const router = useRouter();

  const [comunicados,  setComunicados]  = useState([]);
  const [productos,    setProductos]    = useState([]);
  const [cargando,     setCargando]     = useState(true);

  async function cargarDatos() {
    try {
      const [resComunicados, resProductos] = await Promise.all([
        api.get("/api/v1/comunicados/filtro", { params: { torre: "general" } }),
        api.get("/api/v1/comercio/filtro",    { params: { disponible: true } }),
      ]);

      setComunicados(resComunicados.data.data.slice(0, 3));
      setProductos(resProductos.data.data.slice(0, 3));
    } catch (err) {
      console.log("Error cargando datos inicio:", err);
    } finally {
      setCargando(false);
    }
  }

  useEffect(() => { cargarDatos(); }, []);

  return (
    <View style={global.pantalla}>

      {/* HEADER */}
      <Header titulo="Convivva" />

      <ScrollView style={global.contenido} showsVerticalScrollIndicator={false}>

        {/* ACCESOS RÁPIDOS */}
        <FlatList
          data={ACCESOS}
          numColumns={2}
          scrollEnabled={false}
          columnWrapperStyle={{ gap: 12 }}
          contentContainerStyle={{ gap: 12, marginBottom: 8 }}
          keyExtractor={(item) => item.ruta}
          renderItem={({ item }) => (
            <Pressable
              style={s.accesoBtn}
              onPress={() => router.push(item.ruta)}
            >
              <Image source={item.imagen} style={s.accesoIcono} resizeMode="contain" />
              <Text style={s.accesoLabel}>{item.label}</Text>
            </Pressable>
          )}
        />

        {/* ── COMUNICADOS RECIENTES ── */}
        <View style={s.seccionFila}>
          <Text style={global.seccionTitulo}>Avisos recientes</Text>
          <Pressable onPress={() => router.push("/comunicados")}>
            <Text style={s.verTodos}>Ver todos →</Text>
          </Pressable>
        </View>

        {cargando ? (
          <ActivityIndicator color="#6fa8c2" style={{ marginTop: 16 }} />
        ) : comunicados.length === 0 ? (
          <Text style={s.vacio}>Sin comunicados recientes</Text>
        ) : (
          comunicados.map((item, i) => (
            <CardComunicado
              key={i}
              concepto={item.concepto}
              descripcion={item.descripcion}
              fecha={item.fecha}
              torre={item.torre}
            />
          ))
        )}

        {/* ── PRODUCTOS EN VENTA ── */}
        <View style={s.seccionFila}>
          <Text style={global.seccionTitulo}>En venta</Text>
          <Pressable onPress={() => router.push("/comercio")}>
            <Text style={s.verTodos}>Ver todos →</Text>
          </Pressable>
        </View>

        {cargando ? (
          <ActivityIndicator color="#6fa8c2" style={{ marginTop: 16 }} />
        ) : productos.length === 0 ? (
          <Text style={s.vacio}>Sin productos disponibles</Text>
        ) : (
          productos.map((item, i) => (
            <Pressable
              key={i}
              style={s.productoCard}
              onPress={() => router.push("/comercio")}
            >
              <View style={s.productoIcono}>
                <Text style={{ fontSize: 30 }}>
                  {item.categoria === "Tecnologia" ? "📱" : "🏷️"}
                </Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={s.productoNombre} numberOfLines={2}>
                  {item.texto}
                </Text>
                <Text style={s.productoPrecio}>
                  {formatPrecio(item.precio)}
                </Text>
                <Text style={s.productoCategoria}>
                  {item.categoria} · Torre {item.torre}
                </Text>
              </View>
              <View style={s.productoDisponible}>
                <Text style={s.productoDisponibleTexto}>Disponible</Text>
              </View>
            </Pressable>
          ))
        )}

        <View style={{ height: 16 }} />

      </ScrollView>

      <Navbar />
    </View>
  );
}

const s = StyleSheet.create({
  accesoBtn: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
    flex: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 5,
    elevation: 3,
  },
  accesoIcono: { width: 48, height: 48, marginBottom: 6, borderRadius: 8 },
  accesoLabel: { fontSize: 14, fontWeight: "700", color: "#2f3e46" },

  seccionFila: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginTop: 8,
  },
  verTodos: { color: "#6fa8c2", fontWeight: "700", fontSize: 13, marginBottom: 6 },
  vacio:    { color: "#999", fontSize: 14, textAlign: "center", marginVertical: 12 },

  productoCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 14,
    marginBottom: 10,
    gap: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 5,
    elevation: 3,
  },
  productoIcono: {
    width: 56,
    height: 56,
    borderRadius: 14,
    backgroundColor: "#e7f3f9",
    alignItems: "center",
    justifyContent: "center",
  },
  productoNombre:    { fontSize: 14, fontWeight: "700", color: "#2f3e46", marginBottom: 2 },
  productoPrecio:    { fontSize: 15, fontWeight: "800", color: "#6fa8c2", marginBottom: 2 },
  productoCategoria: { fontSize: 12, color: "#999" },
  productoDisponible: {
    backgroundColor: "#e6f4ea",
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 4,
    alignSelf: "flex-start",
  },
  productoDisponibleTexto: { fontSize: 11, color: "#27ae60", fontWeight: "700" },
});