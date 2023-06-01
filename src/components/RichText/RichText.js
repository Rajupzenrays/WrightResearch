import "./styles.css";
import { useEffect, useRef, useState } from "react";
import suneditor from "suneditor";
import plugins from "suneditor/src/plugins";
import "suneditor/dist/css/suneditor.min.css";
import axios from "axios";
import { message, Spin } from "antd";

export default function RichText() {
  const editorRef = useRef(null);
  const textareaRef = useRef(null);
  const [showPopup, setShowPopup] = useState(false);
  const [writerName, setWriterName] = useState("");
  const [writerAddress, setWriterAddress] = useState("");
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    editorRef.current = suneditor.create("myTextarea", {
      plugins: plugins,
      width: "100%",
      height: "50px",
      minHeight: "400px",
      buttonList: [
        // Default button list
        ["undo", "redo"],
        ["font", "fontSize", "formatBlock"],
        ["paragraphStyle", "blockquote"],
        ["bold", "underline", "italic", "strike", "subscript", "superscript"],
        ["fontColor", "hiliteColor", "textStyle"],
        ["removeFormat"],
        ["outdent", "indent"],
        ["align", "horizontalRule", "list", "lineHeight"],
        ["table", "link", "image", "video", "audio"],
        ["fullScreen", "showBlocks", "codeView"],
        ["save", "template"],
      ],
      historyStackDelayTime: 100,
      attributesWhitelist: {
        all: "style",
      },
    });

    return () => {
      editorRef.current.destroy();
    };
  }, []);

  function removeHtmlTags(input) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(input, "text/html");
    return doc.body.textContent;
  }

  const handlePublish = () => {
    setShowPopup(true);
  };

  const handleCancel = () => {
    setShowPopup(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const content = editorRef.current.getContents();
    const result = removeHtmlTags(content);

    const details = { title, text: result, writerName, writerAddress };
    if (!title || !writerName || !writerAddress || !result) {
      message.error("Please fill all the details");
      return;
    }

    setLoading(true); // Set loading state to true

    axios
      .post("http://localhost:8082/createRichText", details)
      .then((response) => {
        console.log("Response:", response.data);
        message.success("Blog post created successfully");
        setShowPopup(false);
        setTitle("");
        setWriterName("");
        setWriterAddress("");

        // Clear the editor content
        editorRef.current.destroy();
        editorRef.current = suneditor.create("myTextarea", {
          plugins: plugins,
          width: "100%",
          height: "50px",
          minHeight: "400px",
          buttonList: [
            // Default button list
            ["undo", "redo"],
            ["font", "fontSize", "formatBlock"],
            ["paragraphStyle", "blockquote"],
            ["bold", "underline", "italic", "strike", "subscript", "superscript"],
            ["fontColor", "hiliteColor", "textStyle"],
            ["removeFormat"],
            ["outdent", "indent"],
            ["align", "horizontalRule", "list", "lineHeight"],
            ["table", "link", "image", "video", "audio"],
            ["fullScreen", "showBlocks", "codeView"],
            ["save", "template"],
          ],
          historyStackDelayTime: 100,
          attributesWhitelist: {
            all: "style",
          },
        });

        // Clear the textarea value
        textareaRef.current.value = "";
        setLoading(false); // Set loading state to false after successful submission
      })
      .catch((error) => {
        console.error("Error:", error.message);
        message.error("An error occurred while creating the blog post");
        setLoading(false); // Set loading state to false if there's an error
      });
  };

  return (
    <div style={{ position: "relative" }}>
      <div className="heading-text">
        <h1>Write and Publish Your blog post</h1>
      </div>
      <form className="App" onSubmit={handleSubmit}>
        <div className="title_btn_container">
          <input
            type="text"
            name="title"
            value={title}
            placeholder="Enter the Title"
            required
            onChange={(e) => {
              setTitle(e.target.value);
            }}
          />
          <button type="button" onClick={handlePublish}>
            Publish
          </button>
        </div>
        <textarea id="myTextarea" ref={textareaRef} />
      </form>
      {showPopup && (
        <div className="popup-container">
        {loading? <Spin size="large" /> :<div className="popup">
            <h2>Writer Details</h2>
            <label htmlFor="writerName">Name:</label>
            <input
              type="text"
              id="writerName"
              value={writerName}
              onChange={(e) => setWriterName(e.target.value)}
              placeholder="Raju"
              required
            />
            <label htmlFor="writerAddress">From:</label>
            <input
              type="text"
              id="writerAddress"
              placeholder="Assam India"
              value={writerAddress}
              onChange={(e) => setWriterAddress(e.target.value)}
              required
            />
            <div className="popup-buttons">
              <button type="button" onClick={handleCancel}>
                Cancel
              </button>
              <button type="submit" onClick={handleSubmit}>
                Submit
              </button>
            </div>
          </div>}
        </div>
      )}
    </div>
  );
}
