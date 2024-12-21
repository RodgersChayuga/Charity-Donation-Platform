import ProgressBar from "@/components/ProgressBar";
import LazyImage from '@/components/LazyImage';
import DonationInput from "@/components/DonationInput";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="flex flex-col dark:bg-gray-800 bg-[#F5F5FF] min-h-screen px-8 gap-8  font-[family-name:var(--font-geist-sans)]">

      <Header />
      <main className="flex-1 flex flex-col md:flex-row gap-8 items-center sm:items-start">
        <div className="flex flex-col flex-1 gap-8">
          <div>
            <h3 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold">Help Children Reach</h3>
            <h3 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold">Their Full Potential</h3>
          </div>
          <p className="text-[#B5B4BC] text-sm md:text-lg lg:text-xl">
            We work tirelessly to ensure that children have access to quality education, regardless of their background. Our initiatives range from building schools in underserved communities to providing scholarships and educational materials.
          </p>
          <div className="mt-8 ">
            <DonationInput />
          </div>
        </div>
        <div className="flex-1 pl-4 w-full" >
          <LazyImage
            src="/images/student.jpg"
            alt="Picture of the students in school"
            className='hidden md:block'
          />
          <ProgressBar />
        </div>

      </main>
      <Footer />
    </div>
  );
}
