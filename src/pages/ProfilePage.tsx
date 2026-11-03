import React, { useState } from 'react';
import {
  User as UserIcon,
  Mail,
  Phone,
  Shield,
  Heart,
  Save,
  CheckCircle2,
  Stethoscope,
  AlertCircle,
  Plus,
  X,
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../components/common/Toast';
import { DisclaimerBanner } from '../components/common/DisclaimerBanner';

export const ProfilePage: React.FC = () => {
  const { user, updateProfile } = useAuth();
  const { showToast } = useToast();

  const [name, setName] = useState(user?.name || 'Dr. Pratham, M.D.');
  const [email, setEmail] = useState(user?.email || 'pratham@healthpulse.ai');
  const [age, setAge] = useState<number | string>(user?.age || 42);
  const [gender, setGender] = useState<any>(user?.gender || 'Male');
  const [bloodGroup, setBloodGroup] = useState(user?.bloodGroup || 'O+');

  const [emergencyName, setEmergencyName] = useState(user?.emergencyContact?.name || 'Riya Sharma');
  const [emergencyPhone, setEmergencyPhone] = useState(user?.emergencyContact?.phone || '+1 (555) 234-8971');
  const [emergencyRelation, setEmergencyRelation] = useState(user?.emergencyContact?.relation || 'Spouse');

  const [physicianName, setPhysicianName] = useState(user?.physician?.name || 'Dr. Gregory House');
  const [physicianClinic, setPhysicianClinic] = useState(user?.physician?.clinic || 'Princeton Diagnostic Ambulatory');
  const [physicianPhone, setPhysicianPhone] = useState(user?.physician?.phone || '+1 (555) 890-4321');

  const [allergies, setAllergies] = useState<string[]>(user?.allergies || ['Penicillin', 'Sulfa drugs']);
  const [newAllergy, setNewAllergy] = useState('');

  const [isSaving, setIsSaving] = useState(false);

  const addAllergy = () => {
    if (newAllergy.trim() && !allergies.includes(newAllergy.trim())) {
      setAllergies([...allergies, newAllergy.trim()]);
      setNewAllergy('');
    }
  };

  const removeAllergy = (item: string) => {
    setAllergies(allergies.filter((a) => a !== item));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await updateProfile({
        name,
        email,
        age: Number(age),
        gender,
        bloodGroup,
        emergencyContact: {
          name: emergencyName,
          phone: emergencyPhone,
          relation: emergencyRelation,
        },
        physician: {
          name: physicianName,
          clinic: physicianClinic,
          phone: physicianPhone,
        },
        allergies,
      });
      showToast('Profile and medical contact info updated successfully', 'success');
    } catch {
      showToast('Failed to save profile changes', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in max-w-4xl mx-auto">
      {/* Header Bar */}
      <div className="bg-navy-900/90 p-6 rounded-3xl border border-navy-800 shadow-glass flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <img
            src={
              user?.avatar ||
              'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250'
            }
            alt="Avatar"
            className="w-16 h-16 rounded-2xl object-cover border-2 border-cyan-400/50 shadow-glow-cyan"
          />
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">{name}</h2>
            <p className="text-xs text-slate-400 font-mono mt-0.5">
              MRN #HP-98124 &bull; {user?.provider === 'google' ? 'Google Account Connected' : 'Local Clinician'}
            </p>
          </div>
        </div>

        <button
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-glow-cyan transition-all active:scale-95"
        >
          <Save className="w-4 h-4" />
          <span>{isSaving ? 'Saving...' : 'Save Profile Changes'}</span>
        </button>
      </div>

      {/* Main Profile Form */}
      <form onSubmit={handleSave} className="space-y-6">
        {/* Card 1: Personal Demographics */}
        <div className="bg-white dark:bg-navy-900/90 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-navy-800 shadow-sm dark:shadow-glass text-slate-900 dark:text-white">
          <h3 className="text-sm font-bold uppercase tracking-wider text-cyan-400 mb-5 flex items-center gap-2">
            <UserIcon className="w-4 h-4" />
            <span>Patient Identification & Demographics</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block font-semibold mb-1">Full Legal Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-navy-800 focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="block font-semibold mb-1">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-navy-800 focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="block font-semibold mb-1">Age (Years)</label>
              <input
                type="number"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-navy-800 focus:outline-none focus:border-cyan-500 font-mono"
              />
            </div>

            <div>
              <label className="block font-semibold mb-1">Biological Gender</label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-navy-800 focus:outline-none focus:border-cyan-500"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold mb-1">Blood Group</label>
              <input
                type="text"
                value={bloodGroup}
                onChange={(e) => setBloodGroup(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-navy-800 focus:outline-none focus:border-cyan-500 font-mono font-bold"
              />
            </div>
          </div>
        </div>

        {/* Card 2: Emergency Contact & Attending Physician */}
        <div className="bg-white dark:bg-navy-900/90 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-navy-800 shadow-sm dark:shadow-glass text-slate-900 dark:text-white">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Emergency Contact */}
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-rose-400 mb-4 flex items-center gap-2">
                <Heart className="w-4 h-4" />
                <span>Emergency Contact</span>
              </h3>
              <div className="space-y-3 text-xs">
                <div>
                  <label className="block font-medium mb-1">Contact Name</label>
                  <input
                    type="text"
                    value={emergencyName}
                    onChange={(e) => setEmergencyName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-navy-800 focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="block font-medium mb-1">Relationship</label>
                  <input
                    type="text"
                    value={emergencyRelation}
                    onChange={(e) => setEmergencyRelation(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-navy-800 focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="block font-medium mb-1">Emergency Phone</label>
                  <input
                    type="text"
                    value={emergencyPhone}
                    onChange={(e) => setEmergencyPhone(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-navy-800 focus:outline-none focus:border-cyan-500 font-mono"
                  />
                </div>
              </div>
            </div>

            {/* Attending Physician */}
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-emerald-400 mb-4 flex items-center gap-2">
                <Stethoscope className="w-4 h-4" />
                <span>Primary Care Physician</span>
              </h3>
              <div className="space-y-3 text-xs">
                <div>
                  <label className="block font-medium mb-1">Physician Name</label>
                  <input
                    type="text"
                    value={physicianName}
                    onChange={(e) => setPhysicianName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-navy-800 focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="block font-medium mb-1">Hospital / Clinic</label>
                  <input
                    type="text"
                    value={physicianClinic}
                    onChange={(e) => setPhysicianClinic(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-navy-800 focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="block font-medium mb-1">Clinic Phone</label>
                  <input
                    type="text"
                    value={physicianPhone}
                    onChange={(e) => setPhysicianPhone(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-navy-800 focus:outline-none focus:border-cyan-500 font-mono"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Card 3: Allergies and Alerts */}
        <div className="bg-white dark:bg-navy-900/90 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-navy-800 shadow-sm dark:shadow-glass text-slate-900 dark:text-white">
          <h3 className="text-sm font-bold uppercase tracking-wider text-amber-400 mb-4 flex items-center gap-2">
            <AlertCircle className="w-4 h-4" />
            <span>Documented Allergies & Medical Flags</span>
          </h3>

          <div className="flex flex-wrap gap-2 mb-4">
            {allergies.map((allergy) => (
              <span
                key={allergy}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-medium"
              >
                <span>{allergy}</span>
                <button
                  type="button"
                  onClick={() => removeAllergy(allergy)}
                  className="hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </span>
            ))}
          </div>

          <div className="flex items-center gap-2 max-w-sm">
            <input
              type="text"
              value={newAllergy}
              onChange={(e) => setNewAllergy(e.target.value)}
              placeholder="Add allergy (e.g. Latex, Aspirin)"
              className="flex-1 px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-navy-800 focus:outline-none focus:border-cyan-500"
            />
            <button
              type="button"
              onClick={addAllergy}
              className="px-3 py-2 rounded-xl bg-navy-800 hover:bg-navy-700 text-cyan-400 border border-cyan-500/30 text-xs font-semibold"
            >
              Add
            </button>
          </div>
        </div>
      </form>

      <DisclaimerBanner variant="inline" />
    </div>
  );
};
