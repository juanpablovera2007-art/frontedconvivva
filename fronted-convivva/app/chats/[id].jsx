import { useCallback, useEffect, useRef, useState } from "react";
import {
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Linking,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import { conversaciones } from "./index";

export default function ChatDetalle() {
  const router  = useRouter();
  const { id }  = useLocalSearchParams();
  const flatRef = useRef(null);

  const conv = conversaciones.find(function (c) { return c.vendedorId === id; });

  const [mensajes, setMensajes] = useState(conv ? [...conv.mensajes] : []);
  const [texto,    setTexto]    = useState("");
  const [llamando, setLlamando] = useState(false); // simulación de llamada

  useEffect(function () {
    if (conv) conv.noLeidos = 0;
  }, []);

  useEffect(function () {
    if (flatRef.current && mensajes.length > 0) {
      setTimeout(function () {
        flatRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [mensajes]);

  // ── Llamar al vendedor ─────────────────────────────────────────
  function iniciarLlamada() {
    const tel = conv?.telefono;

    if (!tel) {
      // Simulación cuando no hay teléfono real
      setLlamando(true);
      setTimeout(function () { setLlamando(false); }, 4000);
      return;
    }

    // En dispositivo real abre el marcador
    const url = "tel:" + tel.replace(/\s/g, "");
    Linking.canOpenURL(url).then(function (puede) {
      if (puede) {
        Linking.openURL(url);
      } else {
        // Fallback web: simulación visual
        setLlamando(true);
        setTimeout(function () { setLlamando(false); }, 4000);
      }
    });
  }

  // ── Enviar mensaje ────────────────────────────────────────────
  function enviar() {
    const t = texto.trim();
    if (!t) return;

    const nuevo = {
      id:    Date.now(),
      texto: t,
      mio:   true,
      hora:  new Date().toLocaleTimeString("es-CO", { hour: "2-digit", minute: "2-digit" }),
    };

    const actualizados = [...mensajes, nuevo];
    setMensajes(actualizados);
    setTexto("");

    if (conv) {
      conv.mensajes      = actualizados;
      conv.ultimoMensaje = t;
      conv.hora          = nuevo.hora;
    }

    // Simular respuesta del vendedor
    setTimeout(function () {
      const respuesta = {
        id:    Date.now() + 1,
        texto: "Hola, gracias por tu mensaje. Te responderé pronto 👋",
        mio:   false,
        hora:  new Date().toLocaleTimeString("es-CO", { hour: "2-digit", minute: "2-digit" }),
      };
      setMensajes(function (prev) {
        const nuevos = [...prev, respuesta];
        if (conv) {
          conv.mensajes      = nuevos;
          conv.ultimoMensaje = respuesta.texto;
          conv.hora          = respuesta.hora;
        }
        return nuevos;
      });
    }, 3000);
  }

  // ── Sin conversación ──────────────────────────────────────────
  if (!conv) {
    return (
      <View style={s.centrado}>
        <Text style={{ fontSize: 40, marginBottom: 12 }}>💬</Text>
        <Text style={{ fontSize: 15, color: "#666" }}>Conversación no encontrada</Text>
        <Pressable style={s.btnVolver} onPress={function () { router.back(); }}>
          <Text style={s.btnVolverTexto}>← Volver</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={s.pantalla}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={0}
    >

      {/* ── Header ── */}
      <View style={s.header}>
        <Pressable onPress={function () { router.back(); }} style={s.btnBack}>
          <Text style={s.btnBackTexto}>←</Text>
        </Pressable>

        <View style={s.headerInfo}>
          <View style={s.avatarPeq}>
            <Text style={s.avatarLetra}>{conv.vendedorInicial}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={s.headerNombre}>{conv.vendedorNombre}</Text>
            <Text style={s.headerUbicacion}>🏢 Torre {conv.torre} · Apto {conv.apto}</Text>
            {conv.telefono ? (
              <Text style={s.headerUbicacion}>📞 {conv.telefono}</Text>
            ) : null}
          </View>
        </View>

        {/* Botón llamar en header */}
        <Pressable style={s.btnLlamarHeader} onPress={iniciarLlamada}>
          <Text style={{ fontSize: 20 }}>📞</Text>
        </Pressable>
      </View>

      {/* ── Modal de llamada simulada ── */}
      {llamando && (
        <View style={s.llamadaOverlay}>
          <View style={s.llamadaCard}>
            <View style={s.llamadaAvatar}>
              <Text style={{ fontSize: 40, color: "#fff", fontWeight: "700" }}>
                {conv.vendedorInicial}
              </Text>
            </View>
            <Text style={s.llamadaNombre}>{conv.vendedorNombre}</Text>
            <Text style={s.llamadaSubtexto}>Torre {conv.torre} · Apto {conv.apto}</Text>
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

      {/* ── Mensajes ── */}
      <FlatList
        ref={flatRef}
        data={mensajes}
        keyExtractor={function (m) { return String(m.id); }}
        style={s.lista}
        contentContainerStyle={s.listaContent}
        showsVerticalScrollIndicator={false}
        renderItem={function ({ item }) {
          return (
            <View style={[s.burbuja, item.mio ? s.burbujaPropia : s.burbujaAjena]}>
              <Text style={[s.burbujaTexto, item.mio ? s.textoProp : s.textoAjeno]}>
                {item.texto}
              </Text>
              <Text style={[s.burbujaHora, item.mio ? { color: "rgba(255,255,255,0.65)" } : { color: "#aaa" }]}>
                {item.hora}
              </Text>
            </View>
          );
        }}
      />

      {/* ── Input ── */}
      <View style={s.inputRow}>
        <TextInput
          style={s.input}
          placeholder="Escribe un mensaje..."
          placeholderTextColor="#aaa"
          value={texto}
          onChangeText={setTexto}
          multiline
          onSubmitEditing={enviar}
        />
        <Pressable
          style={[s.btnEnviar, !texto.trim() && { opacity: 0.4 }]}
          onPress={enviar}
          disabled={!texto.trim()}
        >
          <Text style={s.btnEnviarIcono}>➤</Text>
        </Pressable>
      </View>

    </KeyboardAvoidingView>
  );
}

const s = StyleSheet.create({
  pantalla: { flex: 1, backgroundColor: "#cfd8dc" },
  centrado: {
    flex: 1, alignItems: "center", justifyContent: "center",
    backgroundColor: "#cfd8dc", padding: 30,
  },

  // Header
  header: {
    backgroundColor: "#6fa8c2",
    paddingTop: Platform.OS === "web" ? 25 : 55,
    paddingBottom: 14,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    gap: 10,
  },
  btnBack:      { padding: 6 },
  btnBackTexto: { fontSize: 24, color: "#fff", fontWeight: "700" },
  headerInfo: { flexDirection: "row", alignItems: "center", gap: 10, flex: 1 },
  avatarPeq: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.3)",
    alignItems: "center", justifyContent: "center",
  },
  avatarLetra:     { fontSize: 18, fontWeight: "700", color: "#fff" },
  headerNombre:    { fontSize: 15, fontWeight: "700", color: "#fff" },
  headerUbicacion: { fontSize: 11, color: "rgba(255,255,255,0.75)", marginTop: 1 },
  btnLlamarHeader: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.25)",
    alignItems: "center", justifyContent: "center",
  },

  // Simulación de llamada
  llamadaOverlay: {
    position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: "rgba(0,0,0,0.75)",
    alignItems: "center", justifyContent: "center",
    zIndex: 99,
  },
  llamadaCard: {
    backgroundColor: "#2f3e46",
    borderRadius: 28,
    padding: 36,
    alignItems: "center",
    width: "80%",
  },
  llamadaAvatar: {
    width: 90, height: 90, borderRadius: 45,
    backgroundColor: "#6fa8c2",
    alignItems: "center", justifyContent: "center",
    marginBottom: 16,
  },
  llamadaNombre:  { fontSize: 22, fontWeight: "700", color: "#fff", marginBottom: 4 },
  llamadaSubtexto:{ fontSize: 13, color: "rgba(255,255,255,0.65)", marginBottom: 16 },
  llamadaEstado:  { fontSize: 15, color: "#a8d8ea", marginBottom: 30 },
  btnColgar: {
    width: 64, height: 64, borderRadius: 32,
    backgroundColor: "#e74c3c",
    alignItems: "center", justifyContent: "center",
  },

  // Lista
  lista:        { flex: 1 },
  listaContent: { padding: 16, paddingBottom: 8 },

  // Burbujas
  burbuja: {
    maxWidth: "78%", borderRadius: 18,
    paddingHorizontal: 14, paddingVertical: 10, marginBottom: 8,
  },
  burbujaPropia: {
    backgroundColor: "#6fa8c2", alignSelf: "flex-end", borderBottomRightRadius: 4,
  },
  burbujaAjena: {
    backgroundColor: "#fff", alignSelf: "flex-start", borderBottomLeftRadius: 4,
    shadowColor: "#000", shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.07, shadowRadius: 3, elevation: 2,
  },
  burbujaTexto: { fontSize: 15, lineHeight: 21 },
  textoProp:    { color: "#fff" },
  textoAjeno:   { color: "#2f3e46" },
  burbujaHora:  { fontSize: 10, marginTop: 4, alignSelf: "flex-end" },

  // Input
  inputRow: {
    flexDirection: "row", alignItems: "flex-end",
    gap: 10, padding: 12,
    backgroundColor: "#fff",
    borderTopWidth: 1, borderTopColor: "#e0e0e0",
  },
  input: {
    flex: 1, backgroundColor: "#f0f4f6", borderRadius: 22,
    paddingHorizontal: 16, paddingVertical: 10,
    fontSize: 15, color: "#2f3e46", maxHeight: 100,
  },
  btnEnviar: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: "#6fa8c2", alignItems: "center", justifyContent: "center",
  },
  btnEnviarIcono: { fontSize: 18, color: "#fff" },

  btnVolver: {
    marginTop: 20, backgroundColor: "#6fa8c2",
    paddingHorizontal: 24, paddingVertical: 12, borderRadius: 12,
  },
  btnVolverTexto: { color: "#fff", fontWeight: "700" },
});

