import Link from "next/link";

const Hero = () => (
  <div className="hero min-h-screen">
    <div className="hero-content text-center">
      <div className="max-w-md">
        <h1 className="text-5xl font-bold">Challenge yourself</h1>
        <p className="py-6">
          Join a burgeoning community of like minded security enthusiasts from
          all walks of life in learning, developing your skills and pushing the
          boundaries of possibility. Manifest your full potential.
        </p>
        <Link href="/signup">
          <button className="btn btn-primary">Join Now</button>
        </Link>
      </div>
    </div>
  </div>
);

export default Hero;
