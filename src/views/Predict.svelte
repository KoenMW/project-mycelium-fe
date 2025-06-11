<script lang="ts">
  import type { PredictionResult } from "../core/types";
  import { getFirstPreview } from "../core/utils";

  let files: FileList | null = $state(null);
  let previewUrl = $derived(getFirstPreview(files));
  let uploading = $state(false);
  let uploadMessage = $state("");

  let result: PredictionResult | null = $state(null);

  const uploadImage = async () => {
    if (!files) {
      alert("No image selected!");
      return;
    }

    const file = files.item(0);

    if (!file) {
      alert("No image selected!");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    uploading = true;
    uploadMessage = "";

    try {
      console.log("uploading to: ", `${import.meta.env.VITE_API_URL}predict`);
      const response = await fetch(`${import.meta.env.VITE_API_URL}predict`, {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        uploadMessage = "Upload successful!";
        result = await response.json();
      } else {
        uploadMessage = "Upload failed!";
      }
    } catch (error) {
      console.error(error);
      uploadMessage = "Error uploading image.";
    } finally {
      uploading = false;
    }
  };
</script>

<div class="shadow">
  <input type="file" accept="image/*" bind:files />
  {#if previewUrl}
    <img src={previewUrl} alt="preview" class="preview" />
  {/if}
  <button onclick={uploadImage} disabled={uploading}>
    {uploading ? "Uploading..." : "Upload"}
  </button>
  {#if uploadMessage}
    <p>{uploadMessage}</p>
  {/if}

  {#if result}
    <p>confidence: {result.prediction.confidence}</p>
    <p>predicted day: {result.prediction.predicted_class}</p>
  {/if}
</div>

<style>
  .preview {
    max-width: 20rem;
    margin-top: 1rem;
  }

  div {
    display: flex;
    gap: 1rem;
    flex-direction: column;
    align-items: center;
    width: min-content;
    align-self: center;
    padding: var(--p-large);
    border-radius: var(--p-medium);
  }

  button {
    background-color: var(--c-green);
  }
</style>
