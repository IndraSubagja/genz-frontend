import Error from '../utils/error';

export default function Custom404() {
  return (
    <div className="content">
      <Error statusCode={404} message="Page Not Found" />
    </div>
  );
}
