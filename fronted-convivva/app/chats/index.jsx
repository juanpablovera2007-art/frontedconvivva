import { useCallback, useState } from "react";
import {
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useFocusEffect, useRouter } from "expo-router";
import Header from "../../assets/componentes/header.jsx";
import Navbar from "../../assets/componentes/navbar.jsx";
import global from "../../assets/styles/stylesheet.js";

const IMG_TV   = require("../../assets/IMG/tv.jpeg");
const IMG_PLAY = require("../../assets/IMG/play.jpeg");

// Almacén en memoria de conversaciones
export let conversaciones = [];

export function agregarOActualizarConversacion(vendedor, producto, mensajeInicial) {
  const idx = conversaciones.findIndex((c) => c.vendedorId === vendedor._id);
  if (idx >= 0) {
    conversaciones[idx].ultimoMensaje = mensajeInicial;
    conversaciones[idx].hora          = new Date().toLocaleTimeString("es-CO", { hour: "2-digit", minute: "2-digit" });
    conversaciones[idx].noLeidos      = (conversaciones[idx].noLeidos || 0) + 1;
  } else {
    conversaciones.push({
      vendedorId:      vendedor._id,
      vendedorNombre:  `${vendedor.nombres} ${vendedor.apellidos}`,
      vendedorInicial: vendedor.nombres?.charAt(0).toUpperCase() || "?",
      torre:           vendedor.torre,
      apto:            vendedor.apto,
      telefono:        vendedor.telefono || null,
      email:           vendedor.email || null,
      ultimoMensaje:   mensajeInicial,
      hora:            new Date().toLocaleTimeString("es-CO", { hour: "2-digit", minute: "2-digit" }),
      noLeidos:        1,
      mensajes: [
        {
          id:    Date.now(),
          texto: mensajeInicial,
          mio:   true,
          hora:  new Date().toLocaleTimeString("es-CO", { hour: "2-digit", minute: "2-digit" }),
        },
      ],
    });
  }
}

export default function Chats() {
  const router = useRouter();
  const [lista, setLista] = useState([]);

  // ✅ useFocusEffect: se ejecuta cada vez que esta pantalla entra al foco
  useFocusEffect(
    useCallback(function () {
      setLista([...conversaciones]);
    }, [])
  );

  function abrirChat(conv) {
    conv.noLeidos = 0;
    router.push("/chats/" + conv.vendedorId);
  }

  if (lista.length === 0) {
    return (
      <View style={global.pantalla}>
        <Header titulo="Chats" />
        <View style={[global.contenido, global.centrado]}>
          <Image source={IMG_TV} style={s.emptyImg} resizeMode="contain" />
          <Text style={global.textoVacio}>
            Aún no tienes conversaciones.{"\n"}
            Contáctate con un vendedor desde la sección de Comercio.
          </Text>
        </View>
        <Navbar />
      </View>
    );
  }

  return (
    <View style={global.pantalla}>
      <Header titulo="Chats" />

      <View style={global.contenido}>
        <FlatList
          data={lista}
          keyExtractor={function (item) { return item.vendedorId; }}
          showsVerticalScrollIndicator={false}
          renderItem={function ({ item }) {
            return (
              <Pressable style={s.conv} onPress={function () { abrirChat(item); }}>

                {/* Avatar */}
                <View style={s.avatar}>
                  <Image source={IMG_PLAY} style={s.avatarImg} resizeMode="cover" />
                </View>

                {/* Info */}
                <View style={s.info}>
                  <View style={s.fila}>
                    <Text style={s.nombre}>{item.vendedorNombre}</Text>
                    <Text style={s.hora}>{item.hora}</Text>
                  </View>
                  <View style={s.fila}>
                    <Text style={s.ultimo} numberOfLines={1}>{item.ultimoMensaje}</Text>
                    {item.noLeidos > 0 && (
                      <View style={s.badge}>
                        <Text style={s.badgeTexto}>{item.noLeidos}</Text>
                      </View>
                    )}
                  </View>
                  <Text style={s.ubicacion}>Torre {item.torre} · Apto {item.apto}</Text>
                </View>

              </Pressable>
            );
          }}
        />
      </View>

      <Navbar />
    </View>
  );
}

const s = StyleSheet.create({
  conv: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 14,
    marginBottom: 10,
    gap: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 5,
    elevation: 3,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "#6fa8c2",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  avatarImg: { width: 52, height: 52, borderRadius: 26 },
  emptyImg: { width: 80, height: 80, marginBottom: 16, opacity: 0.6 },
  info:   { flex: 1 },
  fila:   { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  nombre: { fontSize: 15, fontWeight: "700", color: "#2f3e46" },
  hora:   { fontSize: 11, color: "#aaa" },
  ultimo: { fontSize: 13, color: "#666", flex: 1, marginTop: 3 },
  ubicacion: { fontSize: 11, color: "#aaa", marginTop: 3 },
  badge: {
    backgroundColor: "#6fa8c2",
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 5,
    marginLeft: 6,
  },
  badgeTexto: { fontSize: 11, color: "#fff", fontWeight: "700" },
});

