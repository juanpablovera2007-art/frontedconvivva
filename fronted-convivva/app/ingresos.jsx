import { useState } from "react";
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";

import Header from "../assets/componentes/header";
import Navbar from "../assets/componentes/navbar";
import global from "../assets/styles/stylesheet";

const VISITANTES = [
  { nombre: "Carlos Ramírez",  detalle: "Visitante autorizado • Torre 2" },
];

const PAQUETERIA = [
  { nombre: "Domicilio recibido", detalle: "Apartamento 504" },
];

export default function Ingresos() {
  const router = useRouter();
  const [tab, setTab] = useState("visitantes");

  const datos = tab === "visitantes" ? VISITANTES : PAQUETERIA;

  return (
    <View style={global.pantalla}>

      <Header
        titulo="Ingresos"
        onBack={() => router.back()}
      />

      {/* PESTAÑAS */}
      <View style={s.tabBar}>
        <Pressable
          style={[s.tab, tab === "visitantes" && s.tabActivo]}
          onPress={() => setTab("visitantes")}
        >
          <Image source={require("../assets/IMG/visitante.jpeg")} style={s.tabIcono} resizeMode="contain" />
          <Text style={[s.tabTexto, tab === "visitantes" && s.tabTextoActivo]}>
            Visitantes
          </Text>
        </Pressable>

        <Pressable
          style={[s.tab, tab === "paqueteria" && s.tabActivo]}
          onPress={() => setTab("paqueteria")}
        >
          <Image source={require("../assets/IMG/paquete.jpeg")} style={s.tabIcono} resizeMode="contain" />
          <Text style={[s.tabTexto, tab === "paqueteria" && s.tabTextoActivo]}>
            Paquetería
          </Text>
        </Pressable>
      </View>

      <ScrollView style={global.contenido} showsVerticalScrollIndicator={false}>

        {datos.length === 0 ? (
          <Text style={{ color: "#999", textAlign: "center", marginTop: 32 }}>
            Sin registros
          </Text>
        ) : (
          datos.map((item, i) => (
            <View key={i} style={global.ingresoCard}>
              <Image
                source={tab === "visitantes"
                  ? require("../assets/IMG/visitante.jpeg")
                  : require("../assets/IMG/paquete.jpeg")}
                style={{ width: 40, height: 40, borderRadius: 8 }}
                resizeMode="contain"
              />
              <View>
                <Text style={global.ingresoNombre}>{item.nombre}</Text>
                <Text style={global.ingresoDetalle}>{item.detalle}</Text>
              </View>
            </View>
          ))
        )}

      </ScrollView>

      <Navbar />

    </View>
  );
}

const s = StyleSheet.create({
  tabBar: {
    flexDirection: "row",
    marginHorizontal: 16,
    marginTop: 110,
    marginBottom: -90,
    backgroundColor: "#e0e7ea",
    borderRadius: 14,
    padding: 4,
    zIndex: 10,
  },
  tabIcono: {
    width: 22,
    height: 22,
    marginBottom: 2,
    borderRadius: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 11,
    alignItems: "center",
    flexDirection: "column",
  },
  tabActivo: {
    backgroundColor: "#6fa8c2",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 3,
  },
  tabTexto: {
    fontSize: 14,
    fontWeight: "600",
    color: "#5a7a8a",
  },
  tabTextoActivo: {
    color: "#fff",
  },
});
