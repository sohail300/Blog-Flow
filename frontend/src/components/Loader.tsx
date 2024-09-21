import { newtonsCradle } from "ldrs";
newtonsCradle.register();

const Loader = () => {
  return (
    <>
      <div className="fixed inset-0 flex items-center justify-center bg-gray-100 bg-opacity-75">
        <l-newtons-cradle
          size="120"
          speed="1.4"
          color="#9F5D2B"
        ></l-newtons-cradle>
      </div>
    </>
  );
};

export default Loader;
