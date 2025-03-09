
import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Hand, Brain, Activity } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header';

const FeatureCard: React.FC<{
  icon: React.ReactNode;
  title: string;
  description: string;
}> = ({ icon, title, description }) => (
  <motion.div
    className="glass p-6 rounded-2xl h-full"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    whileHover={{ y: -5, transition: { duration: 0.2 } }}
  >
    <div className="flex flex-col h-full">
      <div className="mb-4 p-3 bg-primary/10 rounded-full w-fit">
        {icon}
      </div>
      <h3 className="text-xl font-medium mb-2">{title}</h3>
      <p className="text-muted-foreground flex-grow">{description}</p>
    </div>
  </motion.div>
);

const Index: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen">
      <Header />

      <section className="pt-32 pb-16 px-4 container mx-auto">
        <div className="max-w-3xl mx-auto text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium mb-4 inline-block">
              Bridging Communication Barriers
            </span>
          </motion.div>

          <motion.h1
            className="text-4xl sm:text-5xl md:text-6xl font-semibold tracking-tight mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            ASL Gesture <span className="text-primary">Recognition</span> Made Simple
          </motion.h1>

          <motion.p
            className="text-xl text-muted-foreground mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            An elegant, intuitive tool for recognizing American Sign Language letters and gestures in real-time, powered by advanced AI technology.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="flex flex-wrap gap-4 justify-center"
          >
            <Button
              onClick={() => navigate('/recognize')}
              size="lg"
              className="rounded-full px-8 group"
            >
              Start Recognition
              <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button
              onClick={() => navigate('/train')}
              variant="outline"
              size="lg"
              className="rounded-full px-8"
            >
              Training Mode
            </Button>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <FeatureCard
            icon={<Hand className="w-6 h-6 text-primary" />}
            title="Real-time Recognition"
            description="Instantly recognize ASL letters and basic gestures through your webcam with smooth, responsive feedback."
          />
          <FeatureCard
            icon={<Brain className="w-6 h-6 text-primary" />}
            title="AI-Powered Accuracy"
            description="Leveraging advanced machine learning models for high-precision hand tracking and gesture interpretation."
          />
          <FeatureCard
            icon={<Activity className="w-6 h-6 text-primary" />}
            title="Training Mode"
            description="Improve recognition by contributing your own hand gestures to help the system learn and adapt."
          />
        </div>
      </section>
      
      <section className="bg-secondary py-20 px-4">
        <div className="container mx-auto max-w-3xl text-center">
          <motion.h2 
            className="text-3xl font-semibold mb-6"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            Break Down Communication Barriers
          </motion.h2>
          <motion.p 
            className="text-lg text-muted-foreground mb-8"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            Whether you're learning ASL, teaching others, or simply exploring new ways to communicate, our tool provides an accessible entry point into the world of sign language.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            <Button
              onClick={() => navigate('/recognize')}
              size="lg"
              className="rounded-full px-8"
            >
              Get Started Now
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Index;
