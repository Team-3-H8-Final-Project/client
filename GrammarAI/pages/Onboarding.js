import React, { useRef, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  SafeAreaView,
} from "react-native";
import Carousel from "react-native-reanimated-carousel";
import { useNavigation } from "@react-navigation/native";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

const onboardingData = [
  {
    id: "01",
    title: "Boost Your English, Every Single Day",
    description:
      "Tackle fun daily challenges that sharpen your grammar, vocabulary, and confidence.",
    image: require("../assets/image1.png"),
    buttonText: "Next",
  },
  {
    id: "02",
    title: "Talk with Your AI Buddy",
    description:
      "Practice real conversations with your friendly AI speaking partner.",
    image: require("../assets/image2.png"),
    buttonText: "Next",
  },
  {
    id: "03",
    title: "Master Grammar with Your Voice",
    description:
      "Learn as the app listens, corrects, and guides your grammar in real-time.",
    image: require("../assets/image3.png"),
    buttonText: "Get Started",
  },
];

const Onboarding = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const navigation = useNavigation();
  const carouselRef = useRef(null);

  const handleNext = () => {
    if (activeIndex < onboardingData.length - 1) {
      carouselRef.current?.next();
    } else {
      navigation.navigate("Register");
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.slide}>
      <Image source={item.image} style={styles.image} resizeMode="contain" />
      <View style={styles.textContainer}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.description}>{item.description}</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.carouselContainer}>
          <Carousel
            ref={carouselRef}
            loop={false}
            width={screenWidth}
            height={screenHeight * 0.6}
            data={onboardingData}
            scrollAnimationDuration={500}
            onSnapToItem={(index) => setActiveIndex(index)}
            renderItem={renderItem}
          />
        </View>

        <View style={styles.bottomContainer}>
          <View style={styles.pagination}>
            {onboardingData.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.paginationDot,
                  activeIndex === index ? styles.activeDot : styles.inactiveDot,
                ]}
              />
            ))}
          </View>

          <TouchableOpacity style={styles.button} onPress={handleNext}>
            <Text style={styles.buttonText}>
              {onboardingData[activeIndex]?.buttonText || "Next"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  container: {
    flex: 1,
    justifyContent: "space-between",
  },
  carouselContainer: {
    flex: 1,
    justifyContent: "center",
  },
  slide: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  image: {
    width: screenWidth * 0.8,
    height: screenHeight * 0.4,
    marginBottom: 20,
  },
  textContainer: {
    alignItems: "center",
    marginTop: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    lineHeight: 24,
    maxWidth: "100%",
  },
  bottomContainer: {
    paddingBottom: 40,
  },
  pagination: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 30,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: "#4285F4",
  },
  inactiveDot: {
    backgroundColor: "#E0E0E0",
  },
  button: {
    backgroundColor: "#4285F4",
    paddingVertical: 15,
    borderRadius: 12,
    marginHorizontal: 40,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
});

export default Onboarding;
