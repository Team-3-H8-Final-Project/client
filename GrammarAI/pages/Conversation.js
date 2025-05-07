<<<<<<< HEAD
"use client";
=======
import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import UserCard from "../components/UserCard";
import { assistant, vapi } from "../helpers/vapiSetup";
import axiosInstance from "../helpers/axiosInstance";
import { useNavigation } from "@react-navigation/native";
import { getSecure } from "../helpers/secureStore";
>>>>>>> e463b30443048039a72a1a2e7d32cc036d0f9b21

import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  SafeAreaView,
  StatusBar,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import UserCard from "../components/UserCard";
const Conversation = () => {
<<<<<<< HEAD
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#AFAFAF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Percakapan</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.content}>
        <UserCard label="Teman AI" isAI={true} />
        <UserCard label="Kamu" />

        <TouchableOpacity style={styles.callButton}>
          <Ionicons
            name="call"
            size={20}
            color="#fff"
            style={styles.callIcon}
          />
          <Text style={styles.callButtonText}>Mulai Percakapan</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
=======
  const [callStatus, setCallStatus] = useState('INACTIVE')
  const [messages, setMessages] = useState([])
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [lastMessage, setLastMessage] = useState('')
  const navigation = useNavigation()

  const handleClick = () => {
    vapi.start('baaea691-670b-4d35-b7b8-2788ffed7ae8')
    console.log(vapi)
    console.log('VAPI started');
  }

  useEffect(() => {
    const onCallStarted = () => {
      setCallStatus('ACTIVE')
    }

    const onCallFinished = () => {
      setCallStatus('FINISHED')
    }

    const onMessage = (message) => {
      if (message.type === "transcript" && message.transcriptType === "final") {
        const newMessage = { role: message.role, content: message.transcript };
        setMessages((prev) => [...prev, newMessage]);
      }
    };

    const onSpeechStart = () => {
      setIsSpeaking(true)
    }

    const onSpeechEnd = () => {
      setIsSpeaking(false)
    }

    const onError = (error) => {
      console.log('Error:', error);
    }

    vapi.on('call-started', onCallStarted)
    vapi.on('call-end', onCallFinished)
    vapi.on('message', onMessage)
    vapi.on('speech-start', onSpeechStart)
    vapi.on('speech-end', onSpeechEnd)
    vapi.on('error', onError)
    
    return () => {
      vapi.off('call-started', onCallStarted)
      vapi.off('call-end', onCallFinished)
      vapi.off('message', onMessage)
      vapi.off('speech-start', onSpeechStart)
      vapi.off('speech-end', onSpeechEnd)
      vapi.off('error', onError)
    }
  }, []) 

  useEffect(() => {
    if (messages.length > 0) {
      setLastMessage(messages[messages.length - 1].content);
    }

    if (callStatus === 'FINISHED') {
        navigation.navigate('MainApp')
    }
  }, [messages, callStatus]);
  
  const handleCall = async() => {
    setCallStatus('CONNECTING');
    try {
      const access_token = await getSecure('access_token')

      const response = await axiosInstance({
        method: 'GET',
        url: `/conversation?theme=daily-life&skill=speaking&time=3`,
        headers: {
          'Authorization': `Bearer ${access_token}`
        }
      })

      const questions = response.data.questions
      const parsed = JSON.parse(questions)

      console.log(response.data);

      let formattedQuestions = parsed
      .map((question) => `- ${question}`)
      .join("\n");

      vapi.start(assistant ,{
        variableValues: {
          questions: formattedQuestions,
        }
      })
    } catch (error) {
      console.log(error);
    }
  }

  const handleDisconnect = () => {
    setCallStatus('FINISHED');
    vapi.stop()
  };

  return (
    <View style={styles.container}>
      <UserCard label="Teman AI" />
      <UserCard label="Kamu" />
      {
        callStatus !== 'ACTIVE' ? (
          <TouchableOpacity style={styles.callButton} onPress={handleCall}>
            <Text style={styles.callButtonText}>
            {callStatus === "INACTIVE" || callStatus === "FINISHED"
                ? "Telepon"
                : ". . ."}
            </Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.callButton} onPress={handleDisconnect}>
            <Text style={styles.callButtonText}>Selesai</Text>
          </TouchableOpacity>
        )
      }
    </View>
>>>>>>> e463b30443048039a72a1a2e7d32cc036d0f9b21
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#3C3C3C",
  },
  content: {
    flex: 1,
    padding: 20,
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#3C3C3C",
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#6F6F6F",
    marginBottom: 32,
    textAlign: "center",
  },
  userCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F7F7F7",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    width: "100%",
    borderWidth: 2,
    borderColor: "#E5E5E5",
    position: "relative",
  },
  aiCard: {
    backgroundColor: "#E7F9E0",
    borderColor: "#58CC02",
  },
  avatarContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
    borderWidth: 2,
    borderColor: "#E5E5E5",
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  userInfo: {
    flex: 1,
  },
  userLabel: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#3C3C3C",
    marginBottom: 4,
  },
  userStatus: {
    fontSize: 14,
    color: "#6F6F6F",
  },
  cardBadge: {
    position: "absolute",
    top: -10,
    right: 16,
    backgroundColor: "#1CB0F6",
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#fff",
  },
  infoContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "#F0F7FF",
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
    marginBottom: 32,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: "#3C3C3C",
    marginLeft: 12,
    lineHeight: 20,
  },
  callButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#58CC02",
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    shadowColor: "#58CC02",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  callIcon: {
    marginRight: 8,
  },
  callButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default Conversation;