import { useEffect, useRef, useState } from "react";
import {
  Alert, Pressable, StyleSheet, Text, View,
} from "react-native";
import { useRouter } from "expo-router";
import { CameraView, useCameraPermissions } from "expo-camera";

export default function EscanerQR() {

  const router  = useRouter();
  const [permission, requestPermission] = useCameraPermissions();
  const [escaneando, setEscaneando]     = useState(true);
  const procesando = useRef(false);

  useEffect(function () {
    if (permission && !permission.granted) {
      requestPermission();
    }
  }, [permission]);

  function onCodigoEscaneado({ data }) {
    if (procesando.current) return;
    procesando.current = true;
    setEscaneando(false);

    Alert.alert(
      "QR válido ✅",
      "Acceso autorizado. Bienvenido.",
      [
        {
          text: "Continuar",
          onPress: function () { router.replace("/ingresos"); },
        },
      ]
    );
  }

  // FIX 1: replace en vez de back para que siempre funcione
  function volver() {
    router.replace("/");
  }

  // ── Esperando permisos ───────────────────────────────────────
  if (!permission) {
    return (
      <View style={s.centro}>
        <Text style={s.texto}>Solicitando permiso de cámara...</Text>
      </View>
    );
  }

  // ── Sin permiso ──────────────────────────────────────────────
  if (!permission.granted) {
    return (
      <View style={s.centro}>
        <Text style={s.texto}>
          Se necesita acceso a la cámara para escanear el QR del visitante.
        </Text>
        <Pressable style={s.boton} onPress={requestPermission}>
          <Text style={s.botonTexto}>Dar permiso</Text>
        </Pressable>
        <Pressable style={[s.boton, s.botonVolver]} onPress={volver}>
          <Text style={s.botonTexto}>← Volver</Text>
        </Pressable>
      </View>
    );
  }

  // ── Cámara ───────────────────────────────────────────────────
  return (
    <View style={s.pantalla}>

      <CameraView
        style={StyleSheet.absoluteFillObject}
        facing="back"
        barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
        onBarcodeScanned={escaneando ? onCodigoEscaneado : undefined}
      />

      <View style={s.overlay}>

        {/* FIX 1: botón volver arriba izquierda con replace */}
        <Pressable style={s.btnVolver} onPress={volver}>
          <Text style={s.btnVolverTexto}>← Volver</Text>
        </Pressable>

        <Text style={s.titulo}>Escanea el QR del visitante 📷</Text>

        {/* Visor con esquinas */}
        <View style={s.visor}>
          <View style={[s.esquina, s.tl]} />
          <View style={[s.esquina, s.tr]} />
          <View style={[s.esquina, s.bl]} />
          <View style={[s.esquina, s.br]} />
          <View style={s.lineaEscaneo} />
        </View>

        <Text style={s.instruccion}>
          Coloca el código QR dentro del recuadro
        </Text>

        {/* FIX 2: botón circular abajo al centro → va a /inicio */}
        <Pressable
          style={s.btnInicio}
          onPress={function () { router.replace("/inicio"); }}
        />

      </View>

    </View>
  );
}

const VISOR  = 260;
const ESQ    = 28;
const GROSOR = 4;
const COLOR  = "#72C0E1";

const s = StyleSheet.create({

  pantalla: {
    flex: 1,
    backgroundColor: "#000",
  },

  overlay: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-around",
    paddingVertical: 60,
    backgroundColor: "rgba(0,0,0,0.35)",
  },

  // Volver — arriba izquierda
  btnVolver: {
    position: "absolute",
    top: 50,
    left: 20,
    backgroundColor: "rgba(0,0,0,0.5)",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
  },

  btnVolverTexto: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 15,
  },

  titulo: {
    fontSize: 22,
    fontWeight: "700",
    color: "#fff",
    textAlign: "center",
    paddingHorizontal: 30,
    marginTop: 60,
  },

  visor: {
    width: VISOR,
    height: VISOR,
    position: "relative",
  },

  esquina: {
    position: "absolute",
    width: ESQ,
    height: ESQ,
    borderColor: COLOR,
  },

  tl: { top: 0,    left: 0,    borderTopWidth: GROSOR,    borderLeftWidth: GROSOR  },
  tr: { top: 0,    right: 0,   borderTopWidth: GROSOR,    borderRightWidth: GROSOR },
  bl: { bottom: 0, left: 0,    borderBottomWidth: GROSOR, borderLeftWidth: GROSOR  },
  br: { bottom: 0, right: 0,   borderBottomWidth: GROSOR, borderRightWidth: GROSOR },

  lineaEscaneo: {
    position: "absolute",
    top: "50%",
    left: 10,
    right: 10,
    height: 2,
    backgroundColor: COLOR,
    opacity: 0.7,
  },

  instruccion: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 14,
    textAlign: "center",
    paddingHorizontal: 40,
  },

  // FIX 2: círculo abajo sin texto → va a inicio
  btnInicio: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: COLOR,
    borderWidth: 5,
    borderColor: "rgba(255,255,255,0.3)",
  },

  // ── Sin permisos ──────────────────────────────────────────
  centro: {
    flex: 1,
    backgroundColor: "#1a2a35",
    alignItems: "center",
    justifyContent: "center",
    padding: 30,
  },

  texto: {
    color: "#fff",
    fontSize: 16,
    textAlign: "center",
    marginBottom: 24,
  },

  boton: {
    backgroundColor: "#6fa8c2",
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 12,
    marginTop: 12,
  },

  botonVolver: {
    backgroundColor: "rgba(255,255,255,0.15)",
  },

  botonTexto: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 15,
    textAlign: "center",
  },
});
