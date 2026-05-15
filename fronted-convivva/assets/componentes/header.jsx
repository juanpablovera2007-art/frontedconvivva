import { useState } from "react";
import { Image, Modal, Pressable, Text, View } from "react-native";
import { useRouter } from "expo-router";
import global from "../styles/stylesheet";

export default function Header({ titulo, onBack }) {
  const router = useRouter();
  const [menuVisible, setMenuVisible] = useState(false);

  function cerrarSesion() {
    setMenuVisible(false);
    router.replace("/");
  }

  return (
    <View style={global.header}>

      <Pressable onPress={onBack}>
        <Text style={global.headerBoton}>←</Text>
      </Pressable>

      <Text style={global.headerTitulo}>
        {titulo}
      </Text>

      {/* Botón 3 puntos */}
      <Pressable onPress={() => setMenuVisible(true)} style={{ padding: 4 }}>
        <Image
          source={require("../IMG/3puntos.jpeg")}
          style={{ width: 28, height: 28, borderRadius: 14 }}
          resizeMode="cover"
        />
      </Pressable>

      {/* Modal cerrar sesión */}
      <Modal
        transparent
        visible={menuVisible}
        animationType="fade"
        onRequestClose={() => setMenuVisible(false)}
      >
        <Pressable
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.35)",
            justifyContent: "flex-start",
            alignItems: "flex-end",
          }}
          onPress={() => setMenuVisible(false)}
        >
          <View
            style={{
              marginTop: 90,
              marginRight: 16,
              backgroundColor: "#fff",
              borderRadius: 12,
              paddingVertical: 8,
              minWidth: 180,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.18,
              shadowRadius: 8,
              elevation: 8,
            }}
          >
            <Pressable
              onPress={cerrarSesion}
              style={({ pressed }) => ({
                paddingVertical: 14,
                paddingHorizontal: 20,
                backgroundColor: pressed ? "#f0f0f0" : "#fff",
                borderRadius: 12,
                flexDirection: "row",
                alignItems: "center",
                gap: 10,
              })}
            >
              <Text style={{ fontSize: 16, color: "#d9534f", fontWeight: "600" }}>
                Cerrar sesión
              </Text>
            </Pressable>
          </View>
        </Pressable>
      </Modal>

    </View>
  );
}
