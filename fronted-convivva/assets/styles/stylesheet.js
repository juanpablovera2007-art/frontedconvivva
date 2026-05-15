import { Platform, StyleSheet } from "react-native";

const webShadow = {
  boxShadow: "0px 4px 12px rgba(0,0,0,0.12)",
};

const nativeShadow = {
  shadowColor: "#000",
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.12,
  shadowRadius: 8,
  elevation: 5,
};

const sombra = Platform.OS === "web" ? webShadow : nativeShadow;

const global = StyleSheet.create({

  // ─────────────────────────────────────────────────────────────
  // Pantalla base
  // ─────────────────────────────────────────────────────────────
  pantalla: {
    flex: 1,
    backgroundColor: "#cfd8dc",
  },

  contenido: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 115,
    paddingBottom: 120,
  },

  centrado: {
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
  },

  textoVacio: {
    fontSize: 15,
    color: "#666",
    textAlign: "center",
  },

  // ─────────────────────────────────────────────────────────────
  // Header
  // ─────────────────────────────────────────────────────────────
  header: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,

    backgroundColor: "#6fa8c2",

    paddingTop: Platform.OS === "web" ? 25 : 55,
    paddingBottom: 18,
    paddingHorizontal: 18,

    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",

    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,

    ...sombra,
  },

  headerTitulo: {
    fontSize: 22,
    fontWeight: "700",
    color: "#fff",
  },

  headerBoton: {
    fontSize: 26,
    color: "#fff",
    paddingHorizontal: 4,
  },

  // ─────────────────────────────────────────────────────────────
  // Navbar
  // ─────────────────────────────────────────────────────────────
  navbar: {
    position: "absolute",
    bottom: 18,
    left: 16,
    right: 16,

    height: 72,

    backgroundColor: "#e9ecef",

    borderRadius: 40,

    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",

    paddingHorizontal: 10,

    ...sombra,
  },

  navItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  navTexto: {
    fontSize: 10,
    marginTop: 2,
    color: "#555",
  },

  navTextoActivo: {
    fontSize: 10,
    marginTop: 2,
    color: "#fff",
    fontWeight: "700",
  },

  navCentral: {
    width: 74,
    height: 74,
    borderRadius: 37,

    backgroundColor: "#72C0E1",

    alignItems: "center",
    justifyContent: "center",

    marginTop: -35,

    borderWidth: 5,
    borderColor: "#cfd8dc",

    ...sombra,
  },

  navCentralIcon: {
    width: 32,
    height: 32,
  },

  navCentralLabel: {
    fontSize: 9,
    color: "#fff",
    fontWeight: "700",
    marginTop: 1,
  },

  // Icono imagen para ítems normales del navbar
  navItemIconWrap: {
    width: 54,
    height: 54,
    alignItems: "center",
    justifyContent: "center",
  },

  navIconImg: {
    width: 26,
    height: 26,
  },

  // Cuando el ítem está activo, el ícono queda blanco sobre el círculo azul
  navItemActivo: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: "#6fa8c2",
    alignItems: "center",
    justifyContent: "center",
  },

  // ─────────────────────────────────────────────────────────────
  // Modal de llamada
  // ─────────────────────────────────────────────────────────────
  callModalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.35)",
    justifyContent: "flex-end",
    alignItems: "center",
    paddingBottom: 110,   // sube la tarjeta justo encima del navbar
  },

  callModalCard: {
    width: "80%",
    backgroundColor: "#fff",
    borderRadius: 20,
    paddingVertical: 22,
    paddingHorizontal: 20,
    alignItems: "center",
    ...sombra,
  },

  callModalTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#2f3e46",
    marginBottom: 16,
    textAlign: "center",
  },

  callOptionBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#72C0E1",
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 20,
    width: "100%",
    marginBottom: 10,
  },

  callOptionBtnSecond: {
    backgroundColor: "#6fa8c2",
  },

  callOptionIcon: {
    width: 22,
    height: 22,
    marginRight: 12,
  },

  callOptionText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 15,
  },

  callCancelBtn: {
    marginTop: 4,
    paddingVertical: 8,
    paddingHorizontal: 20,
  },

  callCancelText: {
    color: "#888",
    fontSize: 14,
  },

  // ─────────────────────────────────────────────────────────────
  // Cards generales
  // ─────────────────────────────────────────────────────────────
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,

    ...sombra,
  },

  cardTitulo: {
    fontSize: 17,
    fontWeight: "700",
    color: "#2f3e46",
    marginBottom: 4,
  },

  cardSubtitulo: {
    fontSize: 13,
    color: "#666",
  },

  // ─────────────────────────────────────────────────────────────
  // Secciones
  // ─────────────────────────────────────────────────────────────
  seccionTitulo: {
    fontSize: 24,
    fontWeight: "700",
    color: "#2f3e46",

    marginTop: 22,
    marginBottom: 14,

    borderBottomWidth: 3,
    borderBottomColor: "#72C0E1",

    paddingBottom: 5,

    alignSelf: "flex-start",
  },

  // ─────────────────────────────────────────────────────────────
  // Comunicado
  // ─────────────────────────────────────────────────────────────
  comunicadoCard: {
    flexDirection: "row",
    alignItems: "flex-start",

    backgroundColor: "#fff",

    borderRadius: 16,

    padding: 16,
    marginBottom: 12,

    gap: 12,

    ...sombra,
  },

  comunicadoTexto: {
    flex: 1,
  },

  comunicadoTitulo: {
    fontSize: 17,
    fontWeight: "700",
    color: "#2f3e46",
    marginBottom: 4,
    textTransform: "capitalize",
  },

  comunicadoDesc: {
    fontSize: 14,
    color: "#555",
    lineHeight: 21,
  },

  comunicadoFecha: {
    fontSize: 12,
    color: "#6fa8c2",
    marginTop: 8,
    fontWeight: "600",
  },

  // ─────────────────────────────────────────────────────────────
  // Productos
  // ─────────────────────────────────────────────────────────────
  productoItem: {
    flexDirection: "row",
    alignItems: "center",

    backgroundColor: "#fff",

    borderRadius: 16,

    padding: 14,
    marginBottom: 12,

    gap: 14,

    ...sombra,
  },

  productoImagen: {
    width: 88,
    height: 88,

    borderRadius: 14,

    backgroundColor: "#e7f3f9",

    alignItems: "center",
    justifyContent: "center",
  },

  productoTexto: {
    fontSize: 14,
    color: "#2f3e46",
    lineHeight: 20,
  },

  productoPrecio: {
    fontSize: 16,
    fontWeight: "700",
    color: "#6fa8c2",
    marginTop: 6,
  },

  // ─────────────────────────────────────────────────────────────
  // Ingresos
  // ─────────────────────────────────────────────────────────────
  ingresoCard: {
    flexDirection: "row",
    alignItems: "center",

    backgroundColor: "#fff",

    borderRadius: 14,

    padding: 14,
    marginBottom: 12,

    gap: 12,

    ...sombra,
  },

  ingresoNombre: {
    fontSize: 15,
    fontWeight: "700",
    color: "#2f3e46",
  },

  ingresoDetalle: {
    fontSize: 12,
    color: "#666",
    marginTop: 2,
  },

  // ─────────────────────────────────────────────────────────────
  // PQRS
  // ─────────────────────────────────────────────────────────────
  pqrsCard: {
    backgroundColor: "#fff",

    borderRadius: 14,

    padding: 15,
    marginBottom: 12,

    borderLeftWidth: 5,
    borderLeftColor: "#6fa8c2",

    ...sombra,
  },

  pqrsTitulo: {
    fontSize: 15,
    fontWeight: "700",
    color: "#2f3e46",
    marginBottom: 5,
  },

  pqrsDetalle: {
    fontSize: 13,
    color: "#555",
    lineHeight: 19,
  },

  // ─────────────────────────────────────────────────────────────
  // Inputs
  // ─────────────────────────────────────────────────────────────
  inputGroup: {
    marginBottom: 14,
  },

  label: {
    fontSize: 13,
    fontWeight: "600",
    color: "#2f3e46",
    marginBottom: 6,
  },

  input: {
    backgroundColor: "#fff",

    borderRadius: 12,

    paddingHorizontal: 14,
    paddingVertical: 12,

    fontSize: 15,
    color: "#2f3e46",

    borderWidth: 1,
    borderColor: "#dce5ea",
  },

  // ─────────────────────────────────────────────────────────────
  // Botones
  // ─────────────────────────────────────────────────────────────
  btnPrimario: {
    backgroundColor: "#6fa8c2",

    paddingVertical: 14,

    borderRadius: 12,

    alignItems: "center",

    marginTop: 8,

    ...sombra,
  },

  btnPrimarioTexto: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },

  // ─────────────────────────────────────────────────────────────
  // Chips
  // ─────────────────────────────────────────────────────────────
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,

    borderRadius: 20,

    backgroundColor: "#fff",

    marginRight: 8,

    borderWidth: 1,
    borderColor: "#6fa8c2",
  },

  chipActivo: {
    backgroundColor: "#6fa8c2",
  },

  chipTexto: {
    color: "#6fa8c2",
    fontSize: 13,
    fontWeight: "600",
  },

  chipTextoActivo: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "700",
  },

  // ─────────────────────────────────────────────────────────────
  // Badges
  // ─────────────────────────────────────────────────────────────
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 5,

    borderRadius: 20,

    alignSelf: "flex-start",
  },

  badgeTexto: {
    color: "#fff",
    fontSize: 11,
    fontWeight: "700",
  },

  badgeAceptado: {
    backgroundColor: "#27ae60",
  },

  badgeDenegado: {
    backgroundColor: "#c0392b",
  },

  badgePendiente: {
    backgroundColor: "#f39c12",
  },

  badgeNuevo: {
    backgroundColor: "#72C0E1",
  },

  badgeEnProceso: {
    backgroundColor: "#6fa8c2",
  },

  badgeResuelto: {
    backgroundColor: "#27ae60",
  },

  badgeCerrado: {
    backgroundColor: "#888",
  },

  // ─────────────────────────────────────────────────────────────
  // Login
  // ─────────────────────────────────────────────────────────────
  loginContainer: {
    flex: 1,

    justifyContent: "center",
    alignItems: "center",

    backgroundColor: "#1a2a35",

    padding: 25,
  },

  loginBox: {
    width: "100%",
    maxWidth: 360,

    backgroundColor: "#72C0E1",

    borderRadius: 20,

    padding: 28,

    ...sombra,
  },

  loginTitulo: {
    fontSize: 30,
    fontWeight: "700",
    color: "#fff",

    textAlign: "center",

    marginBottom: 26,
  },

});

export default global;