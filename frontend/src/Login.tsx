import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from './context/AuthContext';
import { jwtDecode } from 'jwt-decode';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const auth = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        try {
            const response = await axios.post('http://localhost:8000/api/token/', { email, password });
            const { access, refresh } = response.data;
            
            // Log the user into the global React state
            auth?.login(access, refresh);

            // Decode the token to find out where to redirect them
            const decoded: any = jwtDecode(access);
            const role = decoded.role;

            if (role === 'STUDENT') navigate('/student');
            else if (role === 'CASHIER') navigate('/cashier');
            else if (role === 'REGISTRAR') navigate('/registrar');
            else if (role === 'ADMIN') navigate('/admin');

        } catch (err) {
            setError('Invalid credentials. Please try again.');
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-100">
            <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-md">
                <h2 className="mb-6 text-center text-3xl font-bold text-gray-800">EMS Login</h2>
                {error && <p className="mb-4 text-center text-red-500">{error}</p>}
                <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Email</label>
                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
                            className="mt-1 w-full rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:ring-blue-500" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Password</label>
                        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required
                            className="mt-1 w-full rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:ring-blue-500" />
                    </div>
                    <button type="submit" 
                        className="w-full rounded-md bg-blue-600 py-2 text-white transition hover:bg-blue-700">
                        Sign In
                    </button>
                </form>
            </div>
        </div>
    );
}