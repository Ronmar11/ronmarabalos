function ThinkingIndicator() {
  return (
    <div className="flex gap-[2px] py-[1px]">
      {['0.2s', '0.3s', '0.4s'].map((delay) => (
        <div
          key={delay}
          style={{ animationDelay: delay }}
          className="h-[5px] w-[5px] animate-dotPulse rounded-[50px] bg-[#505050] opacity-70 dark:bg-[#b5b5b5]"
        />
      ))}
    </div>
  );
}

export default function ChatMessage({ message, avatar }) {
  if (message.role === 'user') {
    return (
      <div className="flex flex-col items-end">
        <div className="bubble-user relative ml-auto max-w-fit rounded-[14px] border border-transparent bg-chat-user px-5 py-4 text-[14px] leading-[1.45] dark:border-[#444] dark:bg-[#2c2c2c] dark:text-white">
          {message.text}
        </div>
      </div>
    );
  }

  return (
    <div className="inline-block">
      <div className="flex items-center gap-[11px]">
        <span
          style={avatar ? { backgroundImage: `url("${avatar}")` } : undefined}
          className="m-0 h-[15px] w-[15px] shrink-0 rounded-full bg-cover bg-center p-1.5"
          aria-hidden="true"
        />
        <p className="text-[15px]">Ronmar Abalos</p>
      </div>
      <div
        className={`bubble-bot relative max-w-fit rounded-[14px] border border-transparent bg-chat-bot text-[14px] leading-[1.45] dark:border-[#3a3a3a] dark:bg-[#1e1e1e] dark:text-[#e5e5e5] ${
          message.thinking ? 'px-4 py-[2px]' : 'px-5 py-4'
        }`}
      >
        {message.thinking ? <ThinkingIndicator /> : message.text}
      </div>
    </div>
  );
}
