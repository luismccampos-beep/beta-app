import { useAIActions } from './useAIActions';
import { useAIState } from './useAIState';
export function useAIContext() {
    return {
        state: useAIState(),
        actions: useAIActions(),
    };
}
//# sourceMappingURL=useAIContext.js.map