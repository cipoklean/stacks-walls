;; guestbook.clar - On-chain guestbook for Stacks bounty

(define-map posts principal {
  content: (string-ascii 200),
  index: uint
})

(define-data-var next-id uint u0)
(define-data-var post-count uint u0)

(define-public (post-message (content (string-ascii 200)))
  (let (
    (author tx-sender)
    (id (var-get next-id))
    (count (var-get post-count))
  )
    (begin
      (var-set next-id (+ id u1))
      (var-set post-count (+ count u1))
      (map-insert posts author {
        content: content,
        index: id
      })
      (ok u1)
    )
  )
)

(define-read-only (get-post-count)
  (ok (var-get post-count))
)

(define-read-only (get-post-by-author (author principal))
  (unwrap! (map-get? posts author) {
    content: (string-ascii 200 0),
    index: u0
  })
)

(define-read-only (get-posts (start uint) (len uint))
  (let ((count (var-get post-count)))
    (if (> count u0)
      (let ((authors (map-keys posts))
            (total (len authors))
            (actual-start (if (> start total) total start))
            (actual-len (if (> (+ actual-start len) total) (- total actual-start) len))
            (sublist (slice authors actual-start actual-len))
            (result (list)))
        (fold result
          (lambda (author acc)
            (let ((post-data (unwrap! (map-get? posts author) (list))))
              (list append (merge post-data { author: author }) acc))
          )
          result
        )
        (ok result)
      )
      (ok (list))
    )
  )
)