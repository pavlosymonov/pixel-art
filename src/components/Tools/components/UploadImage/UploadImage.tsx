import { ChangeEvent } from "react";
import { MdOutlineFileUpload } from "react-icons/md";
import useStore from "../../../../store";

export default function UploadImageButton() {
  const { setImage } = useStore();

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) return;

    if (event.target.files && event.target.files.length > 0) {
      const reader = new FileReader();
      reader.addEventListener("load", () =>
        setImage(reader.result?.toString() || ""),
      );
      reader.readAsDataURL(event.target.files[0]);
    }
  };

  return (
    <>
      <label
        className="tools-button"
        htmlFor="uploadinput"
        title="Загрузить изображение"
      >
        <MdOutlineFileUpload size={20} />
      </label>
      <input
        id="uploadinput"
        type="file"
        accept="image/*"
        onChange={handleFileChange}
      />
    </>
  );
}
