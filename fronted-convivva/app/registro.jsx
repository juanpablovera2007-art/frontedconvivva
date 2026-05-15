import { useState } from "react";
import {
  Alert, KeyboardAvoidingView, Platform,
  Pressable, ScrollView, Text, TextInput, View,
} from "react-native";
import { useRouter } from "expo-router";

import global from "../assets/styles/stylesheet.js";
import api from "../assets/services/api";

export default function Registro() {

  const router = useRouter();

  const [form, setForm] = useState({
    nombres: "", apellidos: "", correo: "",
    contrasena: "", confirmar: "",
    telefono: "", torre: "", apto: "", rol: "residente",
  });
  const [verClave,      setVerClave]      = useState(false);
  const [verConfirmar,  setVerConfirmar]  = useState(false);
  const [cargando,      setCargando]      = useState(false);

  function cambiar(campo, valor) {
    setForm((prev) => ({ ...prev, [campo]: valor }));
  }

  async function registrar() {

    if (!form.nombres.trim() || !form.apellidos.trim() ||
        !form.correo.trim()  || !form.torre.trim()) {
      Alert.alert("Campos requeridos", "Completa nombres, apellidos, correo y torre.");
      return;
    }

    if (!form.contrasena.trim()) {
      Alert.alert("Campos requeridos", "Ingresa una contraseña.");
      return;
    }

    if (form.contrasena.length < 6) {
      Alert.alert("Contraseña débil", "La contraseña debe tener al menos 6 caracteres.");
      return;
    }

    if (form.contrasena !== form.confirmar) {
      Alert.alert("Error", "Las contraseñas no coinciden.");
      return;
    }

    setCargando(true);

    try {

      await api.post("/api/v1/usuarios", {
        nombres:    form.nombres,
        apellidos:  form.apellidos,
        correo:     form.correo,
        contrasena: form.contrasena,
        telefono:   form.telefono,
        torre:      Number(form.torre),
        apto:       form.apto,
        rol:        form.rol,
      });

      // Después del registro va al escáner QR
      router.replace("/escanerqr");

    } catch (err) {

      if (err.code === "ERR_NETWORK") {
        Alert.alert("Sin conexión", "No se puede conectar al servidor.");
      } else if (err.response?.data?.message?.includes("E11000") ||
                 err.response?.data?.message?.includes("duplicate")) {
        Alert.alert("Correo en uso", "Ya existe una cuenta con ese correo.");
      } else {
        Alert.alert("Error", err.response?.data?.message || "No se pudo crear la cuenta.");
      }

    } finally {
      setCargando(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={global.loginContainer}
        keyboardShouldPersistTaps="handled"
      >
        <View style={[global.loginBox, { maxWidth: 380 }]}>

          <Text style={global.loginTitulo}>Crear cuenta 🏘️</Text>

          <Campo label="Nombres *"    placeholder="Juan"               value={form.nombres}   onChangeText={(v) => cambiar("nombres", v)} />
          <Campo label="Apellidos *"  placeholder="Pérez"              value={form.apellidos} onChangeText={(v) => cambiar("apellidos", v)} />
          <Campo label="Correo *"     placeholder="correo@ejemplo.com" value={form.correo}    onChangeText={(v) => cambiar("correo", v)} keyboardType="email-address" autoCapitalize="none" />
          <Campo label="Teléfono"     placeholder="3001234567"         value={form.telefono}  onChangeText={(v) => cambiar("telefono", v)} keyboardType="phone-pad" />

          <View style={{ flexDirection: "row", gap: 10 }}>
            <View style={{ flex: 1 }}>
              <Campo label="Torre *"     placeholder="1"   value={form.torre} onChangeText={(v) => cambiar("torre", v)} keyboardType="numeric" />
            </View>
            <View style={{ flex: 1 }}>
              <Campo label="Apartamento" placeholder="101" value={form.apto}  onChangeText={(v) => cambiar("apto", v)} />
            </View>
          </View>

          {/* CONTRASEÑA */}
          <CampoPassword
            label="Contraseña *"
            placeholder="Mín. 6 caracteres"
            value={form.contrasena}
            onChangeText={(v) => cambiar("contrasena", v)}
            ver={verClave}
            toggleVer={() => setVerClave((v) => !v)}
          />

          {/* CONFIRMAR CONTRASEÑA */}
          <CampoPassword
            label="Confirmar contraseña *"
            placeholder="Repite tu contraseña"
            value={form.confirmar}
            onChangeText={(v) => cambiar("confirmar", v)}
            ver={verConfirmar}
            toggleVer={() => setVerConfirmar((v) => !v)}
          />

          <Pressable
            style={[global.btnPrimario, { backgroundColor: "#2f3e46" }, cargando && { opacity: 0.7 }]}
            onPress={registrar}
            disabled={cargando}
          >
            <Text style={global.btnPrimarioTexto}>
              {cargando ? "Creando cuenta..." : "Registrarse"}
            </Text>
          </Pressable>

          <Pressable
            onPress={() => router.replace("/")}
            style={{ marginTop: 18, alignItems: "center" }}
          >
            <Text style={{ color: "#fff", fontSize: 14, opacity: 0.9 }}>
              ¿Ya tienes cuenta?{" "}
              <Text style={{ fontWeight: "700", textDecorationLine: "underline" }}>
                Iniciar sesión
              </Text>
            </Text>
          </Pressable>

        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

// ─── Componentes auxiliares ───────────────────────────────────────────────────

function Campo({ label, placeholder, value, onChangeText,
                 keyboardType = "default", autoCapitalize = "words" }) {
  return (
    <View style={global.inputGroup}>
      <Text style={[global.label, { color: "#fff" }]}>{label}</Text>
      <TextInput
        style={global.input}
        placeholder={placeholder}
        placeholderTextColor="#aaa"
        value={value}
        onChangeText={onChangeText}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
      />
    </View>
  );
}

function CampoPassword({ label, placeholder, value, onChangeText, ver, toggleVer }) {
  return (
    <View style={global.inputGroup}>
      <Text style={[global.label, { color: "#fff" }]}>{label}</Text>
      <View style={{ position: "relative" }}>
        <TextInput
          style={[global.input, { paddingRight: 48 }]}
          placeholder={placeholder}
          placeholderTextColor="#aaa"
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={!ver}
          autoCapitalize="none"
        />
        <Pressable
          onPress={toggleVer}
          style={{
            position: "absolute",
            right: 14,
            top: 0,
            bottom: 0,
            justifyContent: "center",
          }}
        >
          <Text style={{ fontSize: 18 }}>{ver ? "🙈" : "👁️"}</Text>
        </Pressable>
      </View>
    </View>
  );
}
