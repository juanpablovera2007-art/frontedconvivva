import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useRouter } from "expo-router";

import Header from "../assets/componentes/header.jsx";
import Navbar from "../assets/componentes/navbar.jsx";
import CardComunicado from "../assets/componentes/cardComunicado.jsx";
import global from "../assets/styles/stylesheet.js";
import api from "../assets/services/api";

export default function Comunicados() {
  const router = useRouter();
  const [generales,  setGenerales]  = useState([]);
  const [torre1,     setTorre1]     = useState([]);
  const [torre2,     setTorre2]     = useState([]);
  const [cargando,   setCargando]   = useState(true);

  async function cargarComunicados() {
    try {
      const [resGen, resTorre1, resTorre2] = await Promise.all([
        api.get("/api/v1/comunicados/filtro", { params: { torre: "general" } }),
        api.get("/api/v1/comunicados/filtro", { params: { torre: "1" } }),
        api.get("/api/v1/comunicados/filtro", { params: { torre: "2" } }),
      ]);
      setGenerales(resGen.data.data);
      setTorre1(resTorre1.data.data);
      setTorre2(resTorre2.data.data);
    } catch (err) {
      console.log("Error comunicados:", err);
    } finally {
      setCargando(false);
    }
  }

  useEffect(() => { cargarComunicados(); }, []);

  function Seccion({ imagen, titulo, datos }) {
    return (
      <View style={s.seccion}>
        {/* Encabezado de sección */}
        <View style={s.seccionHeader}>
          <Image source={imagen} style={s.seccionIcono} resizeMode="contain" />
          <Text style={s.seccionTitulo}>{titulo}</Text>
        </View>

        {cargando ? (
          <ActivityIndicator color="#6fa8c2" style={{ marginVertical: 12 }} />
        ) : datos.length === 0 ? (
          <Text style={s.vacio}>Sin comunicados</Text>
        ) : (
          datos.map((item) => (
            <CardComunicado
              key={item._id}
              concepto={item.concepto}
              descripcion={item.descripcion}
              fecha={item.fecha}
              torre={item.torre}
            />
          ))
        )}
      </View>
    );
  }

  return (
    <View style={global.pantalla}>

      <Header titulo="Comunicados" onBack={() => router.back()} />

      <ScrollView style={global.contenido} showsVerticalScrollIndicator={false}>

        <Seccion
          imagen={require("../assets/IMG/informacion.jpeg")}
          titulo="Comunicados generales"
          datos={generales}
        />

        <Seccion
          imagen={require("../assets/IMG/torres.jpeg")}
          titulo="Torre 1"
          datos={torre1}
        />

        <Seccion
          imagen={require("../assets/IMG/torres.jpeg")}
          titulo="Torre 2"
          datos={torre2}
        />

      </ScrollView>

      <Navbar />
    </View>
  );
}

const s = StyleSheet.create({
  seccion: {
    marginBottom: 24,
  },
  seccionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 10,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#cdd8dd",
  },
  seccionIcono: {
    width: 28,
    height: 28,
    borderRadius: 6,
  },
  seccionTitulo: {
    fontSize: 16,
    fontWeight: "700",
    color: "#2f3e46",
  },
  vacio: {
    fontSize: 14,
    color: "#999",
    textAlign: "center",
    marginVertical: 10,
  },
});
