import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";

import Header from "../assets/componentes/header";
import Navbar from "../assets/componentes/navbar";
import global from "../assets/styles/stylesheet";

const MIS_QUEJAS = [
  { titulo: "Ruido excesivo", detalle: "Apartamento 302 reporta música alta durante la noche." },
  { titulo: "Fuga de agua",   detalle: "Se detectó fuga en la zona común del piso 4." },
];

const RESPUESTAS = [];

export default function PQRS() {
  const router = useRouter();
  const [tab, setTab] = useState("quejas");

  const datos = tab === "quejas" ? MIS_QUEJAS : RESPUESTAS;

  return (
    <View style={global.pantalla}>

      <Header titulo="PQRS" onBack={() => router.back()} />

      {/* PESTAÑAS */}
      <View style={s.tabBar}>
        <Pressable
          style={[s.tab, tab === "quejas" && s.tabActivo]}
          onPress={() => setTab("quejas")}
        >
          <Text style={[s.tabTexto, tab === "quejas" && s.tabTextoActivo]}>
            Mis quejas
          </Text>
        </Pressable>

        <Pressable
          style={[s.tab, tab === "respuestas" && s.tabActivo]}
          onPress={() => setTab("respuestas")}
        >
          <Text style={[s.tabTexto, tab === "respuestas" && s.tabTextoActivo]}>
            Respuestas
          </Text>
        </Pressable>
      </View>

      <ScrollView style={global.contenido} showsVerticalScrollIndicator={false}>

        {datos.length === 0 ? (
          <View style={s.vacio}>
            <Text style={s.vacioTexto}>Aún no hay respuestas</Text>
          </View>
        ) : (
          datos.map((item, i) => (
            <View key={i} style={global.pqrsCard}>
              <Text style={global.pqrsTitulo}>{item.titulo}</Text>
              <Text style={global.pqrsDetalle}>{item.detalle}</Text>
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
  tab: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 11,
    alignItems: "center",
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
  vacio: {
    alignItems: "center",
    marginTop: 40,
  },
  vacioTexto: {
    fontSize: 15,
    color: "#999",
  },
});
