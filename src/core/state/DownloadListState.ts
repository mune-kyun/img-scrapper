import { DownloadImageListStateContext, StateEnum } from "@/type";
import { downloadImages } from "@/core/task/download";
import { State } from "./State";
import { DEFAULT_ROOT_DIR } from "@/constant";

class DownloadListState extends State {
  public readonly type: StateEnum = StateEnum.DOWNLOAD_IMAGE_LIST;
  saveDir: string = `${DEFAULT_ROOT_DIR}/${Date.now()}`;
  
  constructor(nextState?: State, saveDir?: string) {
    super(StateEnum.DOWNLOAD_IMAGE_LIST, nextState);
    if (saveDir) {
      this.saveDir = saveDir;
    }
  }

  async task(context: DownloadImageListStateContext): Promise<void> {
    const { images } = context;
    console.log(`Downloading ${images.length} images to: ${this.saveDir}`);
    for (const img of images) {
      console.log(`Image URL: ${img.src}`);
    }

    await downloadImages(images, this.saveDir);
  }
}

export default DownloadListState;