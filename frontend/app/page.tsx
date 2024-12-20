import { ModeToggle } from "@/components/ModeToggle";
import ProgressBar from "@/components/progress-bar";
import Image from "next/image";

export default function Home() {
  return (
    <div className="grid dark:bg-gray-800 bg-[#F5F5FF] grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)] ">
      <ModeToggle />

      <main className="flex gap-8 row-start-2 items-center sm:items-start ">
        <div className="flex-1">
          <>
            <h3 className="text-5xl font-extrabold">Help Children Reach</h3>
            <h3 className="text-5xl font-extrabold">Their Full Potential</h3>
          </>
          <p>
            We work tirelessly to ensure that children have access to quality education, regardless of their background. Our initiatives range from building schools in underserved communities to providing scholarships and educational materials.
          </p>

        </div>
        <div className="flex-1" >
          <div className="h-[500px] relative">
            <Image
              src="/images/student.jpg"
              alt="Picture of the students in school"
              fill
              className="object-cover rounded-md"
            />
          </div>
          <div>
            <ProgressBar />
          </div>
        </div>

      </main>
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center ">
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://x.com/BlockchainDocta"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="https://nextjs.org/icons/file.svg"
            alt="File icon"
            width={16}
            height={16}
          />
          X (Twitter)
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://github.com/RodgersChayuga/Charity-Donation-Platform"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="https://nextjs.org/icons/window.svg"
            alt="Window icon"
            width={16}
            height={16}
          />
          GitHub Repo
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://rodgerschayuga.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="https://nextjs.org/icons/globe.svg"
            alt="Globe icon"
            width={16}
            height={16}
          />
          Portfolio site →
        </a>
      </footer>
    </div>
  );
}
