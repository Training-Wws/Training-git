import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateProfileSuccess } from '../features/auth/authSlice';
import { request } from 'graphql-request';
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai';
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';

const endpoint = 'http://localhost:5000/graphql';

export default function Profile() {
  const { user, token } = useSelector(state => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: user.name, email: user.email, password: '', role: user.role });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // Password rules
  const passwordRules = [
    { regex: /.{8,}/, message: 'At least 8 characters' },
    { regex: /[A-Z]/, message: 'One uppercase letter' },
    { regex: /[!@#$%^&*]/, message: 'One special character' },
  ];

  const validatePassword = (password) => passwordRules.every(rule => rule.regex.test(password));
  const isFormChanged = () => form.name !== user.name || form.email !== user.email || form.password;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFormChanged()) {
      toast.info('No changes to update.');
      return;
    }
    if (form.password && !validatePassword(form.password)) {
      toast.error('Password does not meet requirements');
      return;
    }

    const mutation = `
      mutation UpdateProfile($name:String, $email:String, $password:String) {
        updateProfile(name:$name,email:$email,password:$password) {
          id name email role
        }
      }
    `;

    try {
      const headers = { Authorization: `Bearer ${token}` };
      const data = await request(endpoint, mutation, form, headers);
      dispatch(updateProfileSuccess(data.updateProfile));
      toast.success('Profile updated successfully!');
      setTimeout(() => navigate('/dashboard'), 1000);
    } catch (err) {
      console.error(err);
      toast.error('Update failed!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-purple-100 to-purple-300 p-4">
      <ToastContainer position="bottom-right" />
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md flex flex-col gap-4">
        <h2 className="text-2xl font-bold text-center text-purple-700">Update's Profile</h2>

        {/* Name */}
        <input
          value={form.name}
          placeholder="Name"
          className="border p-3 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
          onChange={e => setForm({ ...form, name: e.target.value })}
        />

        {/* Email */}
        <input
          value={form.email}
          placeholder="Email"
          className="border p-3 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
          onChange={e => setForm({ ...form, email: e.target.value })}
        />

        {/* Password */}
        <div className="relative">
          <input
            value={form.password}
            placeholder="Password"
            type={showPassword ? 'text' : 'password'}
            className="border p-3 rounded w-full focus:outline-none focus:ring-2 focus:ring-purple-500 pr-10"
            onChange={e => setForm({ ...form, password: e.target.value })}
          />
          <button
            type="button"
            className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-500"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <AiFillEyeInvisible className="h-5 w-5" /> : <AiFillEye className="h-5 w-5" />}
          </button>
        </div>

        {/* Password rules */}
        {form.password && (
          <ul className="text-sm text-gray-600 ml-2 mt-1 space-y-1">
            {passwordRules.map((rule, idx) => {
              const isValid = rule.regex.test(form.password);
              return (
                <li key={idx} className={isValid ? 'text-green-600' : 'text-red-500'}>
                  {isValid ? '✔' : '✖'} {rule.message}
                </li>
              );
            })}
          </ul>
        )}

        {/* Role - readonly */}
        <input
          value={form.role}
          placeholder="Role"
          readOnly
          className="border p-3 rounded bg-gray-100 cursor-not-allowed"
        />

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className={`bg-purple-500 text-white p-3 rounded font-semibold hover:bg-purple-600 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {loading ? 'Updating...' : 'Update Profile'}
        </button>
      </form>
    </div>
  );
}
