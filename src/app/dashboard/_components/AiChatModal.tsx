import React, {
  ComponentPropsWithoutRef,
  useEffect,
  useRef,
  useState,
} from "react";
import "@/styles/AiChatModal.css";
import Image from "next/image";
import Button from "@/components/Button/Button";
import { useUser } from "@clerk/nextjs";
import hljs from "highlight.js";
import "highlight.js/styles/github-dark.css"; // Importer un thème de coloration
import ReactMarkdown from "react-markdown";

// Fonction pour appliquer la coloration syntaxique avec highlight.js
const applySyntaxHighlighting = (code: string, language: string) => {
  if (!code) return "";

  try {
    // Si un langage est spécifié et supporté par highlight.js
    if (language && language !== "plaintext") {
      // Essayer d'utiliser le langage spécifié
      try {
        return hljs.highlight(code, { language }).value;
      } catch (e) {
        // Si le langage n'est pas supporté, utiliser la détection automatique
        console.log(
          `Language '${language}' not supported by highlight.js, using auto-detection`
        );
        console.log(e);
        return hljs.highlightAuto(code).value;
      }
    } else {
      // Utiliser la détection automatique si aucun langage n'est spécifié
      return hljs.highlightAuto(code).value;
    }
  } catch (error) {
    console.error("Error applying syntax highlighting:", error);

    // En cas d'erreur, retourner le code avec échappement HTML basique
    return code
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }
};

// Composant pour afficher le message de l'IA avec Markdown et blocs de code
const AiMessageContent = ({ text }: { text: string }) => {
  // Personnaliser le rendu des blocs de code dans ReactMarkdown
  const components = {
    code({
      inline,
      className,
      children,
      ...props
    }: ComponentPropsWithoutRef<"code"> & { inline?: boolean }) {
      const match = /language-(\w+)/.exec(className || "");
      const language = match ? match[1] : "";

      if (!inline && language) {
        // Pour les blocs de code avec langage spécifié
        const code = String(children).replace(/\n$/, "");
        const highlightedCode = applySyntaxHighlighting(code, language);

        return (
          <div className="code-block">
            <div className="code-header">
              {language && <span className="language">{language}</span>}
              <button
                className="copy-button"
                onClick={() => {
                  navigator.clipboard.writeText(code);
                  // Vous pourriez ajouter une notification de copie ici
                }}
              >
                <Image
                  src="/svgs/copy.svg"
                  alt="Copy"
                  width={15}
                  height={15}
                  style={{ marginRight: "5px" }}
                />
                <span>Copier</span>
              </button>
            </div>
            <pre>
              <code dangerouslySetInnerHTML={{ __html: highlightedCode }} />
            </pre>
          </div>
        );
      }

      // Pour le code inline
      return (
        <code className={className} {...props}>
          {children}
        </code>
      );
    },
  };

  return (
    <div className="markdown-content">
      <ReactMarkdown components={components}>{text}</ReactMarkdown>
    </div>
  );
};

const suggestions = [
  "What is Yam?",
  "What can I do in a workspace?",
  "When was Yamify found?",
  "Can I edit my profile?",
  "How long does it take to deploy a project?",
  "Can I only deploy Wordpress project?",
  "What environment will my project be deployed?",
];

interface Message {
  sender: string;
  text: string;
}

interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
}

type Props = {
  setShowAiModal: (Callback: boolean) => void;
};

const AiChatModal = ({ setShowAiModal }: Props) => {
  const { user } = useUser();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [history, setHistory] = useState<ChatSession[]>([]);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const typingTimeout = useRef<NodeJS.Timeout | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isTyping]);

  useEffect(() => {
    const saved = localStorage.getItem("ai-chat-history");
    if (saved) {
      setHistory(JSON.parse(saved));
    }
  }, []);

  const saveToHistory = (newMessages: Message[]) => {
    if (!currentChatId) {
      const id = crypto.randomUUID();
      const title =
        newMessages.find((m) => m.sender === "user")?.text || "Untitled";
      const newSession: ChatSession = {
        id,
        title: title.length > 30 ? title.slice(0, 30) + "..." : title,
        messages: newMessages,
      };
      const updatedHistory = [newSession, ...history];
      setHistory(updatedHistory);
      setCurrentChatId(id);
      localStorage.setItem("ai-chat-history", JSON.stringify(updatedHistory));
    } else {
      const updatedHistory = history.map((chat) =>
        chat.id === currentChatId ? { ...chat, messages: newMessages } : chat
      );
      setHistory(updatedHistory);
      localStorage.setItem("ai-chat-history", JSON.stringify(updatedHistory));
    }
  };

  const handleSend = async (text: string) => {
    if (!text.trim()) return;

    const userMsg = { sender: "user", text };
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInput("");
    setIsTyping(true);
    setProcessing(true);

    // Créer un nouvel AbortController pour cette requête
    abortControllerRef.current = new AbortController();
    const signal = abortControllerRef.current.signal;

    try {
      console.log("Sending message to webhook:", text);

      // Envoyer le message au webhook
      const response = await fetch(
        "https://n8n.srv791038.hstgr.cloud/webhook/5a4d3259-9051-4bc0-8271-be9b3bede317",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            // Format simplifié qui pourrait être plus compatible avec le webhook
            message: text,
            // Conserver ces informations pour le débogage
            metadata: {
              userId: user?.id || "anonymous",
              timestamp: new Date().toISOString(),
            },
          }),
          signal, // Passer le signal pour permettre l'annulation
        }
      );

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data = await response.json();
      console.log("Received response from webhook:", data);

      // Extraire la réponse selon le format spécifié [{ "output": "..." }]
      let responseText = `Je n'ai pas pu générer une réponse pour: "${text}"`;

      if (Array.isArray(data) && data.length > 0) {
        if (data[0].output) {
          responseText = data[0].output;
        } else {
          console.log(
            "Response format incorrect, expected [{ output: '...' }]"
          );
        }
      } else if (typeof data === "object" && data !== null) {
        // Essayer de trouver une propriété qui pourrait contenir la réponse
        if (data.output) {
          responseText = data.output;
        } else if (data.response) {
          responseText = data.response;
        } else if (data.message) {
          responseText = data.message;
        } else {
          console.log("Response format not recognized:", data);
        }
      }

      console.log("Final response text:", responseText);

      const aiMsg = {
        sender: "ai",
        text: responseText,
      };

      const finalMessages = [...updatedMessages, aiMsg];
      setMessages(finalMessages);
      saveToHistory(finalMessages);
    } catch (error) {
      // Ne pas afficher d'erreur si la requête a été annulée intentionnellement
      if (signal.aborted) {
        console.log("Request was aborted");
        return;
      }

      console.error("Error sending message to webhook:", error);

      // Message d'erreur en cas d'échec
      const aiMsg = {
        sender: "ai",
        text: "Désolé, je n'ai pas pu traiter votre demande. Veuillez réessayer plus tard.",
      };

      const finalMessages = [...updatedMessages, aiMsg];
      setMessages(finalMessages);
      saveToHistory(finalMessages);
    } finally {
      if (!signal.aborted) {
        setIsTyping(false);
        setProcessing(false);
      }
    }
  };

  const handleStop = () => {
    // Annuler le timeout si présent
    if (typingTimeout.current) {
      clearTimeout(typingTimeout.current);
    }

    // Annuler la requête fetch si en cours
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    setIsTyping(false);
    setProcessing(false);
  };

  const loadChatFromHistory = (id: string) => {
    const chat = history.find((h) => h.id === id);
    if (chat) {
      setMessages(chat.messages);
      setCurrentChatId(chat.id);
      setInput("");
      setIsTyping(false);
      setProcessing(false);
    }
  };

  const handleNewChat = () => {
    setMessages([]);
    setCurrentChatId(null);
    setInput("");
    setIsTyping(false);
    setProcessing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !processing) {
      handleSend(input);
    }
  };

  return (
    <div className="ai-chat-modal">
      <div className="ai-chat-system">
        <div className="history">
          <div className="head">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="15"
              height="15"
              viewBox="0 0 15 15"
              fill="none"
            >
              <path
                d="M13.4375 1.25H1.5625C0.70125 1.25 0 1.95063 0 2.8125V13.75H15V2.8125C15 1.95063 14.2987 1.25 13.4375 1.25ZM0.625 2.8125C0.625 2.29562 1.04562 1.875 1.5625 1.875H9.375V13.125H0.625V2.8125ZM14.375 13.125H10V1.875H13.4375C13.9544 1.875 14.375 2.29562 14.375 2.8125V13.125ZM11.25 6.25H13.125V6.875H11.25V6.25ZM11.25 8.75H13.125V9.375H11.25V8.75ZM11.25 3.75H13.125V4.375H11.25V3.75Z"
                fill="#F8F8F8"
              />
            </svg>
          </div>
          <div className="content">
            <h3>History</h3>

            <Button
              text={"New Chat"}
              yellow={false}
              linkBtn={false}
              onClick={handleNewChat}
            />

            <ul>
              {history.map((chat) => (
                <li key={chat.id} onClick={() => loadChatFromHistory(chat.id)}>
                  {chat.title}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="chat-box">
          <div className="chat-header">
            <div className="logo">
              <Image
                src={"/svgs/yamify_logo_sm.svg"}
                alt="Yamify Logo"
                className="logo-img"
                width={12}
                height={15.2}
              />
              <h2>Yamify AI</h2>
            </div>

            <div className="actions">
              {/* <svg
                xmlns="http://www.w3.org/2000/svg"
                width="15"
                height="15"
                viewBox="0 0 15 15"
                fill="none"
              >
                <path
                  d="M2.5 8.75H6.25M6.25 8.75V12.5M6.25 8.75L1.875 13.125M12.5 6.25H8.75M8.75 6.25V2.5M8.75 6.25L13.125 1.875"
                  stroke="#E6E6E6"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg> */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="15"
                height="15"
                viewBox="0 0 15 15"
                fill="none"
                onClick={() => setShowAiModal(false)}
              >
                <path
                  d="M11.25 3.75L3.75 11.25M3.75 3.75L11.25 11.25"
                  stroke="#E6E6E6"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>

          <div className="messages">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`message ${msg.sender === "user" ? "user" : "ai"}`}
              >
                {msg.sender === "ai" && (
                  <Image
                    src="/svgs/yamifyai.svg"
                    alt=""
                    width={20}
                    height={20}
                  />
                )}
                {msg.sender === "ai" ? (
                  // Utiliser ReactMarkdown pour le formatage du texte de l'IA
                  <AiMessageContent text={msg.text} />
                ) : (
                  // Afficher le texte de l'utilisateur normalement
                  msg.text
                )}
              </div>
            ))}
            {isTyping && (
              <div className="typing-indicator">Yamify AI is typing...</div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {messages.length === 0 && (
            <>
              <div className="intro-msg">
                <Image src="/svgs/yamifyai.svg" alt="" width={32} height={32} />
                <h2>Hi {user?.firstName}!</h2>
                <p>How may I help you?</p>
              </div>
              <div className="suggestions">
                {suggestions.map((s, i) => (
                  <button key={i} onClick={() => handleSend(s)}>
                    {s}
                  </button>
                ))}
              </div>
            </>
          )}

          <div className="input-box">
            <input
              type="text"
              value={input}
              placeholder="Ask anything"
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <Button
              text={processing ? "Stop" : "Send"}
              yellow={true}
              linkBtn={false}
              onClick={processing ? handleStop : () => handleSend(input)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AiChatModal;
