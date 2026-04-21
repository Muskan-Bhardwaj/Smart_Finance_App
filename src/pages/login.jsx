import React, { useState } from 'react';
import { supabase } from '../lib/supabase';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) alert(error.message);
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) alert("Check your email for the confirmation link!");
  };

  return (
    <div style={{ maxWidth: '400px', margin: '100px auto', textAlign: 'center', fontFamily: 'sans-serif' }}>
      <h2>Smart Finance Login</h2>
      <form style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} style={{ padding: '10px' }} />
        <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} style={{ padding: '10px' }} />
        <button onClick={handleLogin} style={{ padding: '10px', backgroundColor: '#3b82f6', color: 'white', border: 'none', cursor: 'pointer' }}>Login</button>
        <button onClick={handleSignUp} style={{ background: 'none', border: 'none', color: '#3b82f6', cursor: 'pointer' }}>Don't have an account? Sign Up</button>
      </form>
    </div>
  );
};

export default Login;