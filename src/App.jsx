import { createContext, useState } from 'react';
import { HelmetProvider } from 'react-helmet-async';
import { Toaster } from 'react-hot-toast';
import router from './routes';
import { RouterProvider } from 'react-router-dom'


// 앱에서 사용될 공통 상태 관리를 위한 컨텍스트 객체를 생성합니다.
// useRef 보다는 useContext 로 전역상태 관리를 하는게 권장된다.
export const AppContext = createContext();
/* -------------------------------------------------------------------------- */

function App() {
  // "방 만들기" 폼 입력에 필요한 모든 상태를 관리합니다.
  const [createRoomForm, setCreateRoomForm] = useState({
    category: '',
    title: '',
    content: '',
    price: 0,
    pickup: null,
    payment: '',
    participateCounter: 0,
    meetingPoint: '',
    uploadImage: null,
    status: '',
    location: '',
  });

  // 공급할 앱 상태 값(value)를 작성합니다.
  const appState = {
    // 예: state
    createRoomForm,
    // 예: setState
    updateCreateRoomForm: (key, value) => {
      setCreateRoomForm((state) => {
        return {
          ...state,
          [key]: value,
        };
      });
    },
  };

  return (
    <AppContext.Provider value={appState}>
      <HelmetProvider>
        <div className="max-w-xl mx-auto mt-12 font-pretendard bg-purple-200">
          {/* 모든 페이지에 앱 상태 공급 */}
          <RouterProvider router={router} />
        </div>
      </HelmetProvider>
      <Toaster />
    </AppContext.Provider>
  );
}
export default App;