import { useEffect, useState } from 'react'
import CountUp from 'react-countup'
import styles from './index.module.less'

function Counter(props: any) {
  const [currentSalary, setCurrentSalary] = useState(0)
  const [salaryPersecond, setSalaryPersecond] = useState(0)
  const startSalary = Math.floor(currentSalary * 100) / 100

  useEffect(() => {
    window.api.onUpdateSalary((salary) => {
      setCurrentSalary(salary)
    })
    window.api.onUpdateSalaryPerSecond((value) => {
      setSalaryPersecond(value)
    })
  }, [])

  return (
    <div className={styles.container}>
      <div className={styles.header}>本月累计收入</div>
      <div className={styles.contentWrapper}>
        <CountUp
          className={styles.content}
          start={startSalary}
          end={currentSalary}
          duration={0.5}
          prefix="¥ "
          decimals={6}
        />
        <div className={styles.description}>每秒收入¥ {salaryPersecond.toFixed(6)}</div>
      </div>
    </div>
  )
}

export default Counter
