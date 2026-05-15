import { useState } from "react";
import { Alert, Pressable, Text, TextInput, View } from "react-native";
import { useRouter } from "expo-router";

import global from "../assets/styles/stylesheet.js";
import api from "../assets/services/api";

export default function Index() {

  const router = useRouter();

  const [correo,      setCorreo]      = useState("");
  const [contrasena,  setContrasena]  = useState("");
  const [verClave,    setVerClave]    = useState(false);
  const [cargando,    setCargando]    = useState(false);

  async function entrar() {

    if (!correo.trim()) {
      Alert.alert("Error", "Ingresa tu correo");
      return;
    }
    if (!contrasena.trim()) {
      Alert.alert("Error", "Ingresa tu contraseña");
      return;
    }

    setCargando(true);

    try {

      const res = await api.post("/api/v1/auth/login", {
        correo,
        contrasena,
      });
      console.log("Login OK:", res.data);
      router.replace("/escanerqr");

    } catch (err) {

      if (err.code === "ERR_NETWORK" || err.message === "Network Error") {
        Alert.alert("Sin conexión", "No se puede conectar al servidor.");
      } else if (err.response?.status === 401) {
        Alert.alert("Credenciales incorrectas", "Correo o contraseña incorrectos.");
      } else {
        Alert.alert("Error", err.response?.data?.message || "Algo salió mal.");
      }

    } finally {
      setCargando(false);
    }
  }

  return (
    <View style={global.loginContainer}>
      <View style={global.loginBox}>

        <Text style={global.loginTitulo}>Convivva</Text>

        {/* CORREO */}
        <View style={global.inputGroup}>
          <Text style={[global.label, { color: "#fff" }]}>Correo</Text>
          <TextInput
            style={global.input}
            placeholder="correo@ejemplo.com"
            placeholderTextColor="#aaa"
            value={correo}
            onChangeText={setCorreo}
            autoCapitalize="none"
            keyboardType="email-address"
          />
        </View>

        {/* CONTRASEÑA */}
        <View style={global.inputGroup}>
          <Text style={[global.label, { color: "#fff" }]}>Contraseña</Text>
          <View style={{ position: "relative" }}>
            <TextInput
              style={[global.input, { paddingRight: 48 }]}
              placeholder="••••••••"
              placeholderTextColor="#aaa"
              value={contrasena}
              onChangeText={setContrasena}
              secureTextEntry={!verClave}
              autoCapitalize="none"
            />
            <Pressable
              onPress={() => setVerClave((v) => !v)}
              style={{
                position: "absolute",
                right: 14,
                top: 0,
                bottom: 0,
                justifyContent: "center",
              }}
            >
              <Text style={{ fontSize: 18 }}>{verClave ? "🙈" : "👁️"}</Text>
            </Pressable>
          </View>
        </View>

        <Pressable
          style={[global.btnPrimario, cargando && { opacity: 0.7 }]}
          onPress={entrar}
          disabled={cargando}
        >
          <Text style={global.btnPrimarioTexto}>
            {cargando ? "Ingresando..." : "Iniciar sesión"}
          </Text>
        </Pressable>

        {/* LINK AL REGISTRO */}
        <Pressable
          onPress={() => router.push("/registro")}
          style={{ marginTop: 20, alignItems: "center" }}
        >
          <Text style={{ color: "#fff", fontSize: 14, opacity: 0.9 }}>
            ¿No tienes cuenta?{" "}
            <Text style={{ fontWeight: "700", textDecorationLine: "underline" }}>
              Regístrate aquí
            </Text>
          </Text>
        </Pressable>

      </View>
    </View>
  );
}
