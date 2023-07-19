/**
 * Snk异常类
 * @version 2023/07/19 11:11:11
 * @author ALI[ali-k&#64;foxmail.com]
 * @since 1.0.0
 */
class SnkException extends Error {

  /**
   * Snk异常
   * @param message 信息
   */
  constructor(message?: string) {
    super(message)
    this.name = 'SnkException'
  }
}

export {SnkException}
