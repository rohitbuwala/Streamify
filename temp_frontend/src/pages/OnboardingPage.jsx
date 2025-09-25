import { useMutation, useQueryClient } from '@tanstack/react-query';
import useAuthUser from '../hooks/useAuthUser';
import { toast } from 'react-hot-toast';
import { CameraIcon, LoaderIcon, MapPinIcon, Option, ShipWheelIcon, ShuffleIcon } from 'lucide-react';
import { completeOnboarding } from '../lib/api';
import { useState } from 'react';
import { LANGUAGES } from '../constants';

const OnboardingPage = () => {

  const  { authUser} = useAuthUser();
  const queryClient = useQueryClient();

  const [formstate, setFormState] = useState({
  fullName: authUser?.fullName || "",
  bio:  authUser?.bio || "",
  nativeLanguage: authUser?.nativeLanguage || "",
  learningLanguage: authUser?.learningLanguage || "",
  location: authUser?.location || "",
  profilePic : authUser?.profilePic || "", 
});

  const {mutate:onboardingMutation, isPending} =useMutation({
    mutationFn: completeOnboarding,
    onSuccess: () => {
      toast.success("Profile onboarding successfully");
      queryClient.invalidateQueries({queryKey: ["authUser"]})
    }
  })

  const handleSubmit = (e) => {
    e.preventDefault();

    onboardingMutation(formstate)
  }

  const handleRandomAvatar = () => {
    const idx = Math.floor(Math.random()*100) +1 ;
    const randomAvatar = `https://avatar.iran.liara.run/public/${idx}.png`

    setFormState({...formstate, profilePic: randomAvatar});
    toast.success("Random profile picture generated!")
  };

  return (
    <div className='min-h-screen bg-base-100 flex items-center justify-center p-4'>
      <div className='card bg-base-200 w-full max-w-3xl shadow-xl'>
        <div className='card-body p-6 sm:p-8'>
        <h1 className='text-2xl sm:text-3xl font-bold text-center mb-6'>Complete Your Profile</h1>

        <form onSubmit={handleSubmit} action="">
        {/* PROFILE PIC CONTAINER */}

          <div className='flex flex-col items-center justify-center space-y-4'>
            {/* IMAGE PREVIEW */}
            <div className='size-32 rounded-full bg-base-300 overflow-hidden'>
              {formstate.profilePic ? (
                <img 
                src={formstate.profilePic} 
                alt="Profile Preview" 
                className='w-full h-full object-cover'
                />
              ) : (
                <div className='flex items-center justify-center h-full'>
                  <CameraIcon className='size-12 text-base-content opacity-40'/>
                </div>
              )}
            </div>

            {/* Generate Random Avatar BTN */}
              <div className='flex items-center gap-2'>
                <button type='button' onClick={handleRandomAvatar} className='btn btn-accent'>
                  <ShuffleIcon className='size-4 mr-2'/>
                  Generate Random Avatar
                </button>
              </div>
              {/* Full Name */}
              <div className='form-control'>
              <label className='label'>
                <span className='label-text'>Full Name</span>
              </label>
              <input 
              type="text"
              name='fullName'
              value={formstate.fullName}
              onChange={(e) => setFormState({...formstate, fullName: e.target.value})}
              className='input input-bordered w-full'
              placeholder='Your full name'
              />
              </div>

              {/* BIO  */}
               <div className='form-control'>
              <label className='label'>
                <span className='label-text'>Bio</span>
              </label>
               <textarea 
               name="bio"
               value={formstate.bio}
               onChange={(e) => setFormState({...formstate, bio: e.target.value})}
               className='textarea textarea-bordered h-24' 
               placeholder='Tell others about yourself and your language learning goals'
               />
              </div>

                {/* LAUNGUAGEs  */}
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                {/* Native Language */}
                <div className='form-control'>
                  <label className='label'>
                    <span className='label-text'>Native Language</span>
                  </label>
                  <select value={formstate.nativeLanguage}
                  onChange={(e) => setFormState({...formstate, nativeLanguage: e.target.value})}
                  className='select select-bordered w-full'
                  >
                    <option value="">select your native language</option>
                    {LANGUAGES.map((lang) => (<option key={`native-${lang}`} value={lang.toLowerCase()}>{lang}</option>))}
                  </select>
                </div>
                </div>

                {/* Learning Language */}
                <div className='form-control'>
                <label className='label'>
                  <span className='label-text'>Learning Language</span>
                </label>
                <select name="learningLanguage" 
                value={formstate.learningLanguage}
                onChange={(e) => setFormState({...formstate, learningLanguage: e.target.value})}
                className='select select-bordered w-full'
                >
                  <option value="">Select Language you're learning</option>
                  {LANGUAGES.map((lang) => ( <option key={`learning-${lang}`} value={lang.toLowerCase()}>{lang}</option>))}
                </select>
                </div>

                {/* lOCATION  */}
                <div className='form-control'>
                  <label className='label'>
                    <span className='lebel-text'>Location</span>
                  </label>
                    <div className='relative'>
                      <MapPinIcon className='absolute top-1/2 transform -translate-y-1/2 left-3 size-5 text-base-content opacity-70'/>
                      <input 
                      type="text"
                      name='Location'
                      value={formstate.location}
                      onChange={(e) => setFormState({...formstate, location: e.target.value})}
                      className='input input-bordered w-full pl-10 '
                      placeholder='City, Country'
                      />
                    </div>
                </div>

                {/* SUBMIT BTN */}

              <button className='btn btn-primary w-full' disabled={isPending} type='submit'>
                {isPending ? (
                  <>
                  <LoaderIcon className='animate-spin  size-5 mr-2' />
                  Onboarding...
                  </>
                ) : (
                  <>
                  <ShipWheelIcon className='size-5 mr-2' />
                   complete Onboarding
                  </>
                ) }
              </button>
          </div>

        </form>
        </div>

      </div>
      
    </div>
  )
}

export default OnboardingPage