import { Image, Text, View } from "react-native";
import global from "../styles/stylesheet";

export default function CardComunicado({ concepto, descripcion, fecha, torre }) {
  return (
    <View style={global.comunicadoCard}>

      <View style={{
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: "#e7f3f9",
        justifyContent: "center",
        alignItems: "center",
      }}>
        <Image
          source={require("../IMG/informacion.jpeg")}
          style={{ width: 30, height: 30, borderRadius: 6 }}
          resizeMode="contain"
        />
      </View>

      <View style={global.comunicadoTexto}>
        <Text style={global.comunicadoTitulo}>{concepto}</Text>
        <Text style={global.comunicadoDesc}>{descripcion}</Text>
        <Text style={global.comunicadoFecha}>{fecha} • Torre {torre}</Text>
      </View>

    </View>
  );
}
