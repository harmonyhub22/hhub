import { Button, Page, Text } from '@geist-ui/core';
import { useRouter } from 'next/router'
import Navbar from '../components/Navbar';

const Home = () => {
  const Router = useRouter()
  return (
    <div>
        <Navbar/>
      <div>
          <h1>Harmony Hub</h1>
      </div>
      <Button shadow type="secondary" id="btn-new-session">
        New Session
      </Button>
    </div>
  );
};

export default Home;
