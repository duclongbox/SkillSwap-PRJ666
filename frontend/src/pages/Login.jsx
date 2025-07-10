
import Navbar from '../components/Navbar';
import LoginForm from '../components/LoginForm';
const Login = () => {


  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <LoginForm />
        </div>
      </div>
    </div>
  );
};

export default Login; 