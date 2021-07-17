export default function Error({ statusCode, message }) {
  return (
    <div className="error">
      <h1>{statusCode}</h1>
      <span>|</span>
      <p>{message}</p>
    </div>
  );
}
