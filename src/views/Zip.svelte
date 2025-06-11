<script lang="ts">
  let files: FileList | null = $state(null);
  let uploading = $state(false);
  let uploadMessage = $state("");
  let trainingData = $state(false);

  const uploadZip = async () => {
    if (!files) {
      alert("No file selected!");
      return;
    }

    const file = files.item(0);
    if (
      !file ||
      (file.type !== "application/zip" && !file.name.endsWith(".zip"))
    ) {
      alert("Please upload a valid ZIP file.");
      return;
    }

    const formData = new FormData();
    formData.append("zip_file", file);
    formData.append("trainingData", trainingData.toString()); // ✅ send boolean as string

    uploading = true;
    uploadMessage = "";

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}upload-data`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (response.ok) uploadMessage = "images uploaded succesfully";
      else uploadMessage = "failed to upload images";
    } catch (error) {
      console.error(error);
      uploadMessage = "Error uploading ZIP file.";
    } finally {
      uploading = false;
    }
  };
</script>

<div class="shadow">
  <input type="file" accept=".zip" bind:files />

  <button onclick={uploadZip} disabled={uploading}>
    {uploading ? "Uploading..." : "Upload ZIP"}
  </button>

  {#if uploadMessage}
    <p>{uploadMessage}</p>
  {/if}
</div>

<style>
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

  label {
    margin: 1rem 0;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  button {
    background-color: var(--c-green);
  }
</style>
