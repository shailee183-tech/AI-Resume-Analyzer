export interface PdfConversionResult {
  imageUrl: string;
  file: File | null;
  error?: string;
}

let pdfjsLib: any = null;
let loadPromise: Promise<any> | null = null;

async function loadPdfJs(): Promise<any> {
  if (pdfjsLib) return pdfjsLib;

  if (loadPromise) return loadPromise;

  // @ts-expect-error - pdfjs-dist/build/pdf.mjs is not typed correctly
  loadPromise = import("pdfjs-dist/build/pdf.mjs").then((lib) => {
    lib.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";

    pdfjsLib = lib;

    return lib;
  });

  return loadPromise;
}

export async function convertPdfToImage(
  file: File
): Promise<PdfConversionResult> {
  try {
    const lib = await loadPdfJs();

    const arrayBuffer = await file.arrayBuffer();

    const pdf = await lib.getDocument({
      data: arrayBuffer,
    }).promise;

    const page = await pdf.getPage(1);

    const viewport = page.getViewport({
      scale: 4,
    });

    const canvas = document.createElement("canvas");

    const context = canvas.getContext("2d");

    if (!context) {
      return {
        imageUrl: "",
        file: null,
        error: "Could not create canvas context.",
      };
    }

    canvas.width = viewport.width;
    canvas.height = viewport.height;

    context.imageSmoothingEnabled = true;
    context.imageSmoothingQuality = "high";

    await page.render({
      canvasContext: context,
      viewport,
    }).promise;

    return await new Promise((resolve) => {
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            resolve({
              imageUrl: "",
              file: null,
              error: "Failed to create image blob.",
            });

            return;
          }

          const originalName = file.name.replace(/\.pdf$/i, "");

          const imageFile = new File(
            [blob],
            `${originalName}.png`,
            {
              type: "image/png",
            }
          );

          resolve({
            imageUrl: URL.createObjectURL(blob),
            file: imageFile,
          });
        },
        "image/png",
        1.0
      );
    });
  } catch (err) {
    console.error("PDF ERROR FULL:", err);
    console.log("TYPE:", typeof err);

    if (err instanceof Error) {
      console.log("NAME:", err.name);
      console.log("MESSAGE:", err.message);
      console.log("STACK:", err.stack);
    }

    return {
      imageUrl: "",
      file: null,
      error:
        err instanceof Error
          ? err.message
          : JSON.stringify(err),
    };
  }
}