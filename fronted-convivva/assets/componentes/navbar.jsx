import { useState } from "react";
import {
  Image,
  Modal,
  Pressable,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Link, usePathname } from "expo-router";
import global from "../styles/stylesheet";

const ITEMS_IZQ = [
  { label: "Inicio",   ruta: "/inicio",   icono: require("../IMG/inicio.jpeg") },
  { label: "Ingresos", ruta: "/ingresos", icono: require("../IMG/ingresos.jpeg") },
];

const ITEMS_DER = [
  { label: "Chats", ruta: "/chats", icono: require("../IMG/chats.jpeg") },
  { label: "PQRS",  ruta: "/pqrs",  icono: require("../IMG/pqrs.jpeg") },
];

export default function Navbar() {
  const pathname = usePathname();
  const [modalVisible, setModalVisible] = useState(false);

  function renderItem(item) {
    const activo = pathname === item.ruta || pathname.startsWith(item.ruta + "/");
    return (
      <Link key={item.ruta} href={item.ruta} replace asChild>
        <Pressable style={global.navItem}>
          <View style={activo ? global.navItemActivo : global.navItemIconWrap}>
            <Image
              source={item.icono}
              style={global.navIconImg}
              resizeMode="contain"
            />
          </View>
          <Text style={activo ? global.navTextoActivo : global.navTexto}>
            {item.label}
          </Text>
        </Pressable>
      </Link>
    );
  }

  return (
    <>
      <Modal
        transparent
        visible={modalVisible}
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <Pressable
          style={global.callModalOverlay}
          onPress={() => setModalVisible(false)}
        >
          <Pressable
            style={global.callModalCard}
            onPress={(e) => e.stopPropagation()}
          >
            <Text style={global.callModalTitle}>¿A quién deseas llamar?</Text>

            <TouchableOpacity
              style={global.callOptionBtn}
              onPress={() => { setModalVisible(false); }}
            >
              <Image
                source={require("../IMG/llamada.jpeg")}
                style={global.callOptionIcon}
                resizeMode="contain"
              />
              <Text style={global.callOptionText}>Portería</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[global.callOptionBtn, global.callOptionBtnSecond]}
              onPress={() => { setModalVisible(false); }}
            >
              <Image
                source={require("../IMG/llamada.jpeg")}
                style={global.callOptionIcon}
                resizeMode="contain"
              />
              <Text style={global.callOptionText}>Administración</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={global.callCancelBtn}
              onPress={() => setModalVisible(false)}
            >
              <Text style={global.callCancelText}>Cancelar</Text>
            </TouchableOpacity>
          </Pressable>
        </Pressable>
      </Modal>

      <View style={global.navbar}>
        {ITEMS_IZQ.map(renderItem)}

        <Pressable style={global.navCentral} onPress={() => setModalVisible(true)}>
          <Image
            source={require("../IMG/llamada.jpeg")}
            style={global.navCentralIcon}
            resizeMode="contain"
          />
          <Text style={global.navCentralLabel}>Llamada</Text>
        </Pressable>

        {ITEMS_DER.map(renderItem)}
      </View>
    </>
  );
}