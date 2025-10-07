import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { request } from 'graphql-request';
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai';

const endpoint = 'http://localhost:5000/graphql';

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'user'
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  const passwordRules = [
    { regex: /.{8,}/, message: 'At least 8 characters' },
    { regex: /[A-Z]/, message: 'One uppercase letter' },
    { regex: /[!@#$%^&*]/, message: 'One special character' }
  ];

  const validateField = (field, value) => {
    let error = '';
    switch (field) {
      case 'name':
        if (!value.trim()) error = 'Name is required';
        break;
      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!value.trim()) error = 'Email is required';
        else if (!emailRegex.test(value)) error = 'Invalid email';
        break;
      case 'password':
        if (!value) error = 'Password is required';
        else if (!passwordRules.every(rule => rule.regex.test(value)))
          error = 'Password does not meet requirements';
        if (form.confirmPassword && value !== form.confirmPassword)
          setErrors(prev => ({ ...prev, confirmPassword: 'Passwords do not match' }));
        break;
      case 'confirmPassword':
        if (!value) error = 'Confirm password is required';
        else if (value !== form.password) error = 'Passwords do not match';
        break;
      default:
        break;
    }
    setErrors(prev => ({ ...prev, [field]: error }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    validateField(name, value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Run all validations
    Object.keys(form).forEach(field => validateField(field, form[field]));

    // Check if any errors
    if (Object.values(errors).some(e => e)) return;

    setLoading(true);
    const mutation = `
      mutation Register($name: String!, $email: String!, $password: String!, $role: String!) {
        register(name: $name, email: $email, password: $password, role: $role) {
          token
          user { id name email role }
        }
      }
    `;
    try {
      const data = await request(endpoint, mutation, form);
      localStorage.setItem('token', data.register.token);
      localStorage.setItem('user', JSON.stringify(data.register.user));
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      setErrors({ form: err.response?.errors[0]?.message || 'Registration failed' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-purple-100 to-purple-300 p-4">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md flex flex-col gap-4">
        <h2 className="text-2xl font-bold text-center text-purple-700">Register</h2>

        {errors.form && <p className="text-red-500 text-sm">{errors.form}</p>}

        <div>
          <input
            name="name"
            value={form.name}
            placeholder="Name"
            className="border p-3 rounded w-full focus:outline-none focus:ring-2 focus:ring-purple-500"
            onChange={handleChange}
          />
          {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
        </div>

        <div>
          <input
            name="email"
            value={form.email}
            placeholder="Email"
            className="border p-3 rounded w-full focus:outline-none focus:ring-2 focus:ring-purple-500"
            onChange={handleChange}
          />
          {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
        </div>

       <div className="relative">
  <input
    name="password"
    type={showPassword ? 'text' : 'password'}
    value={form.password}
    placeholder="Password"
    className="border p-3 rounded w-full focus:outline-none focus:ring-2 focus:ring-purple-500 pr-10"
    onChange={handleChange}
  />
  <span
    className="absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer text-gray-500"
    onClick={() => setShowPassword(!showPassword)}
  >
    {showPassword ? <AiFillEyeInvisible size={20} /> : <AiFillEye size={20} />}
  </span>

  {/* Password rules */}
  {form.password && (
    <ul className="text-sm ml-2 mt-1 space-y-1">
      {passwordRules.map((rule, idx) => {
        const isValid = rule.regex.test(form.password);
        return (
          <li key={idx} className={isValid ? 'text-green-600' : 'text-gray-500'}>
            {isValid ? '✔' : '✖'} {rule.message}
          </li>
        );
      })}
    </ul>
  )}
</div>

        <div className="relative">
          <input
            name="confirmPassword"
            type={showConfirm ? 'text' : 'password'}
            value={form.confirmPassword}
            placeholder="Confirm Password"
            className="border p-3 rounded w-full focus:outline-none focus:ring-2 focus:ring-purple-500 pr-10"
            onChange={handleChange}
          />
          <span
            className="absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer text-gray-500"
            onClick={() => setShowConfirm(!showConfirm)}
          >
            {showConfirm ? <AiFillEyeInvisible size={20} /> : <AiFillEye size={20} />}
          </span>
          {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
        </div>

        <select
          name="role"
          value={form.role}
          onChange={handleChange}
          className="border p-3 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>

        <button
          type="submit"
          disabled={loading}
          className={`bg-purple-500 text-white p-3 rounded font-semibold hover:bg-purple-600 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {loading ? 'Registering...' : 'Register'}
        </button>

        <p className="text-center text-gray-600 mt-2">
          Already have an account? <Link to="/" className="text-purple-600 hover:underline">Login</Link>
        </p>
      </form>
    </div>
  );
}
