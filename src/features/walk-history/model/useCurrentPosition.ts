import { useEffect, useState } from 'react';

interface CurrentPositionState {
  latitude: number | null;
  longitude: number | null;
  status: 'loading' | 'success' | 'error';
  errorMessage: string | null;
}

const UNSUPPORTED_STATE: CurrentPositionState = {
  latitude: null,
  longitude: null,
  status: 'error',
  errorMessage: '이 브라우저는 위치 정보를 지원하지 않아요.',
};

/** 브라우저 Geolocation API로 현재 위치 1회 조회 (주변 인기 활동 조회용) */
export function useCurrentPosition() {
  const [state, setState] = useState<CurrentPositionState>(() =>
    typeof navigator !== 'undefined' && navigator.geolocation
      ? { latitude: null, longitude: null, status: 'loading', errorMessage: null }
      : UNSUPPORTED_STATE,
  );

  useEffect(() => {
    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setState({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          status: 'success',
          errorMessage: null,
        });
      },
      () => {
        setState({
          latitude: null,
          longitude: null,
          status: 'error',
          errorMessage: '위치 권한을 허용하면 주변 인기 활동을 볼 수 있어요.',
        });
      },
      { enableHighAccuracy: false, timeout: 8000 },
    );
  }, []);

  return state;
}
