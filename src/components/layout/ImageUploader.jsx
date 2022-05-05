import { Buffer } from "buffer";
import React, { useState } from "react";
import { create } from "ipfs-http-client";
import {
  Form,
  Image,
  Button,
  ProgressBar,
  Container,
  Badge,
} from "react-bootstrap";

const client = create("https://ipfs.infura.io:5001/api/v0");

function ImageUploader() {
  const [file, setFile] = useState(null);
  const [urlArr, setUrlArr] = useState([]);
  const [image, setImage] = useState({});
  const [imagePreview, setImagePreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploaded, setUploaded] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const created = await client.add(file);
      const url = `https://ipfs.infura.io/ipfs/${created.path}`;
      setUrlArr((prev) => [...prev, url]);
    } catch (error) {
      console.log(error.message);
    }
  };
  const createPreview = (e) => {
    if (e.target.value !== "") {
      setImage(e.target.files[0]);
      const src = URL.createObjectURL(e.target.files[0]);
      setImagePreview(src);
    } else {
      setImagePreview("");
    }
  };
  const retrieveFile = (e) => {
    const data = e.target.files[0];
    const reader = new window.FileReader();
    reader.readAsArrayBuffer(data);
    reader.onloadend = () => {
      setFile(Buffer(reader.result));
    };
    createPreview(e);
    e.preventDefault();
  };
  const uploadFile = async (e) => {
    setLoading(true);
    e.preventDefault();

    try {
      const created = await client.add(file);
      const url = `https://ipfs.infura.io/ipfs/${created.path}`;
      setImagePreview(url);
      setUploaded(true);
    } catch (err) {
      console.log("Error uploading the file : ", err);
    }
    setLoading(false);
  };
  const previewAndUploadButton = () => {
    if (imagePreview !== "") {
      if (!loading) {
        return (
          <div>
            {uploaded ? (
              <h5>
                ✅{" "}
                <a
                  href={imagePreview}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Image
                </a>{" "}
                Uploaded Successfully ✅{" "}
              </h5>
            ) : (
              <div>
                <Button type="submit" className="mb-3">
                  Upload Image
                </Button>
                <br />
                <h5>
                  {image.name} <Badge pill>{image.size} kb</Badge>
                </h5>

                <Image
                  style={{ height: "300px" }}
                  className="mb-3"
                  src={imagePreview}
                  thumbnail
                />
              </div>
            )}
          </div>
        );
      } else {
        return (
          <Container>
            <h4>Uploading Image</h4>
            <ProgressBar animated now={100} />
            <h4>Please Wait ...</h4>
          </Container>
        );
      }
    }
  };

  return (
    <div>
      <Form onSubmit={uploadFile} className="form">
        <Form.Control
          required
          type="file"
          accept="image/*"
          onChange={(e) => createPreview(e)}
          className="mb-3"
        />
        {previewAndUploadButton()}
      </Form>
    </div>
  );
}

export default ImageUploader;
