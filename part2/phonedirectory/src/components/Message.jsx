import '../index.css';

const Message = ({ message, messageState }) => {
  if (message === null) {
    return null;
  }
  return <div className={messageState}>{message}</div>;
};

export default Message;
