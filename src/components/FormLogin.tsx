import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import formStyles from "../styles/Form.module.css";

// Define the interface for form data
interface FormData {
  user_name: string;
  email: string;
  password: string;
}

export default function FormLogin() {
  const [formData, setFormData] = useState<FormData>({
    user_name: '',
    email: '',
    password: '',
  });
  const [message, setMessage] = useState<string>('');

  // Update formData on input change
  const handleChange = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value });
  };

  // Submit data to the backend
  const submitData = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/ajouter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (response.ok) {
        setMessage('Utilisateur ajouté avec succès!');
      } else {
        setMessage(data.error || 'Erreur de la requête.');
      }
    } catch (error) {
      setMessage('Erreur lors de la soumission.');
    }
  };

  return (
    <>
    <form className={formStyles.formsignup} onSubmit={submitData}>
    <div className={formStyles.radius}><FontAwesomeIcon icon={faUser} className="text-[40px] pl-[25%] pt-[20%]" /></div>
<div className={formStyles.wavegroup}>
<input  type="text" className={formStyles.input} value={formData.user_name}
            onChange={(e) => handleChange(e.target.name, e.target.value)}name="user_name" />
<span className={formStyles.bar}></span>
<label className={formStyles.label}>
<span className={formStyles.labelchar} >user name</span>
</label>
</div><br /><br />

<div className={formStyles.wavegroup}>
<input  type="email" className={formStyles.input} required value={formData.email}
            onChange={(e) => handleChange(e.target.name, e.target.value)} name="email"/>
<span className={formStyles.bar}></span>
<label className={formStyles.label}>
<span className={formStyles.labelchar} >email</span>
</label>
</div><br /><br />

<div className={formStyles.wavegroup}>
<input  type="password" className={formStyles.input} required value={formData.password}
            onChange={(e) => handleChange(e.target.name, e.target.value)} name="password"/>
<span className={formStyles.bar}></span>
<label className={formStyles.label}>
<span className={formStyles.labelchar}>mot de passe</span>
</label>
</div><br /><br />
<input type="submit" value="login" id={formStyles.btnlogin}/>
<p className='text-black'>{message}</p>
  
    </form>
    </>
)
};
