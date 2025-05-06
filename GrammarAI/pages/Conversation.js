import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import UserCard from "../components/UserCard";
import { assistant, vapi } from "../helpers/vapiSetup";
import axiosInstance from "../helpers/axiosInstance";
import { useNavigation } from "@react-navigation/native";
import { getSecure } from "../helpers/secureStore";

const Conversation = () => {
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
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",

    padding: 20,
  },
  callButton: {
    marginTop: 20,
    backgroundColor: "#4285F4",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 50,
  },
  callButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default Conversation;