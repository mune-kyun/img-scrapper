import { DownloadImageListStateContext, GetImageDetailsStrategyEnum, NavigateStateContext, StateEnum } from "@/type";
import { navigateToPage, scrollToLazyLoad } from "@/core/task/interact";
import { getImageDetails } from "@/core/task/scrape";
import State from "./State";

class NavigateState extends State {
  public readonly type: StateEnum = StateEnum.NAVIGATE;

  constructor(nextState?: State) {
    super(StateEnum.NAVIGATE, nextState);
  }

  async task(context: NavigateStateContext): Promise<void> {
    const { 
      page,
      url,
      shouldScrollToLoad,
      scrollProps,
    } = context;

    await navigateToPage(page, url);

    if (shouldScrollToLoad) {
      await scrollToLazyLoad(page, scrollProps);
    }

    if (this.nextState && this.nextState.type) {
      switch (this.nextState.type) {
        case StateEnum.DOWNLOAD_IMAGE_LIST:
          const imageList = await getImageDetails(page, { strategy: GetImageDetailsStrategyEnum.A_HREF });
          const nextContext: DownloadImageListStateContext = {
            images: imageList,
          };
          await this.nextState.execute(nextContext);
          break;
      }
    }
  }
}

export default NavigateState;