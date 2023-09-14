import {pb} from '@/api/pocketbase';
import Spinner from '@/components/Spinner';
import Header from '@/layout/Header';
import {useState} from 'react';
import {useEffect} from 'react';
import {useRef} from 'react';
import {Helmet} from 'react-helmet-async';
import toast from 'react-hot-toast';
import {useNavigate, useParams} from 'react-router-dom';
import complete from '@/assets/icons/complete.svg';
import proceeding from '@/assets/icons/proceeding.svg';
import waiting from '@/assets/icons/waiting.svg';
import checked from '@/assets/icons/checked.svg';
import styles from '@/styles/ChangeStatus.module.css';
import Button from '@/components/Button';

function ChangeStatus() {
  const {id} = useParams();

  const navigate = useNavigate();

  const selectRef = useRef(null);

  const handleUpdate = async (e) => {
    e.preventDefault();

    const statusValue = selectRef.current.value;

    const formData = new FormData();

    formData.append('status', statusValue);
    try {
      await pb.collection('products').update(id, formData);
      toast.success('진행 상태가 변경되었습니다.', {
        position: 'top-center',
        ariaProps: {
          role: 'status',
          'aria-live': 'polite',
        },
      });
      navigate('/products');
    } catch (error) {
      throw new Error(error);
    }
  };

  const [data, setData] = useState();

  useEffect(() => {
    async function detailProgress() {
      try {
        const getStatus = await pb.collection('products').getOne(id);
        setData(getStatus);
      } catch (error) {
        throw new Error(error);
      }
    }

    detailProgress();
  }, [id]);

  if (data) {
    return (
      <>
        <Helmet>
          <title>R09M - 진행 상태</title>
        </Helmet>
        <h1 className="sr-only">R09M</h1>

        <div className="py-2 h-screen">
          <div className="px-4">
            <Header />
            <h2 className="pageTitle">진행 상태</h2>
          </div>

          <h3 className="font-semibold mt-16">현재 상태</h3>
          {data.status === '대기중' ? (
            <div className={styles.group}>
              <figure className={styles.figure}>
                <img src={waiting} alt="대기중" aria-hidden="true" />
                <figcaption>
                  <h3 className={styles.title}>대기중</h3>
                  <p className={styles.description}>참여자를 기다리고 있어요</p>
                </figcaption>
              </figure>
              <Button type="button">
                <img src={checked} alt="체크" aria-hidden="true" />
              </Button>
            </div>
          ) : data.status === '진행중' ? (
            <div className={styles.group}>
              <figure className={styles.figure}>
                <img src={proceeding} alt="진행중" aria-hidden="true" />
                <figcaption>
                  <h3 className={styles.title}>진행중</h3>
                  <p className={styles.description}>공구가 시작되었어요.</p>
                </figcaption>
              </figure>
              <Button type="button">
                <img src={checked} alt="체크" aria-hidden="true" />
              </Button>
            </div>
          ) : (
            <div className={styles.group}>
              <figure className={styles.figure}>
                <img src={complete} alt="공구종료" aria-hidden="true" />
                <figcaption>
                  <h3 className={styles.title}>공구종료</h3>
                  <p className={styles.description}>공구가 완료되었어요.</p>
                </figcaption>
              </figure>
              <Button type="button">
                <img src={checked} alt="체크" aria-hidden="true" />
              </Button>
            </div>
          )}
          <h3 className="font-semibold mt-24">상태 변경</h3>
          <form onSubmit={handleUpdate}>
            <label htmlFor="status"></label>
            <select
              name="status"
              id="status"
              className="text-center rounded-lg border-solid border-line-400 p-3 border-2 w-[75%] my-5"
              ref={selectRef}
            >
              <option value="대기중">대기중</option>
              <option value="진행중">진행중</option>
              <option value="공구 완료">공구 완료</option>
            </select>
            <button
              type="submit"
              className="text-white text-center font-semibold bg-primary-500 rounded-lg py-3 w-[23%] mx-1 hover:bg-primary-700"
            >
              변경
            </button>
          </form>
        </div>
      </>
    );
  } else {
    <Spinner />;
  }
}

export default ChangeStatus;
