import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";

// Array of color options
const COLORS = [
  "#10b981",
  "#3b82f6",
];

const ChallengeCard = ({
  title,
  description,
  imgUrl,
  backgroundColor,
}) => {
  const navigation = useNavigation();
  const cardColor = backgroundColor || COLORS[Math.floor(Math.random() * COLORS.length)];

  return (
    <View style={[styles.card, { backgroundColor: cardColor }]}>
      <View style={styles.imageContainer}>
        <Image source={{ uri: imgUrl }} style={styles.image} resizeMode="contain" />
      </View>

      <View style={styles.contentContainer}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description}>{description}</Text>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.button, { color: cardColor }]}
          onPress={() => navigation.navigate("ChallengeDetail", { theme: title })}>
          <Text style={[styles.buttonText, { color: cardColor }]}>Take Challenge</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 16,
  },
  imageContainer: {
    height: 120,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 16,
  },
  image: {
    width: 140,
    height: 140,
  },
  contentContainer: {
    padding: 20,
    paddingTop: 20,
    paddingBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
    marginTop: 8,
    textAlign: "center",
  },
  description: {
    fontSize: 14,
    color: "white",
    opacity: 0.9,
    marginTop: 4,
    textAlign: "center",
  },
  footer: {
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  badge: {
    backgroundColor: "rgba(0, 0, 0, 0.2)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  badgeText: {
    color: "white",
    fontSize: 12,
    fontWeight: "500",
  },
  button: {
    backgroundColor: "white",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
  },
  buttonText: {
    fontWeight: "600",
    fontSize: 14,
  },
});

export default ChallengeCard;