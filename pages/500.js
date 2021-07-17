import Error from '../utils/error';

export default function Custom500() {
  return (
    <div className="content">
      <Error statusCode={500} message="Internal Server Error" />
    </div>
  );
}
